require('../../vendor/highstock-release/highstock.src.js');

var _                   = require('lodash');
var moment              = require('moment');
var CONFIG              = require('../config/config.js');
var template            = require('../templates/graphs.html');
var interact            = require('interact');
var ChartBase           = require('./ChartBase.js');
var ChartCandlestick    = require('./ChartCandlestick.js');

var VIEW_MODES = ['area', 'candlestick', 'split', 'split-full'];

var Charts = function(options) {
  options = options || {};

  this._configure(options);
  this._render();
};

Charts.prototype = {
  // Private methods

  _configure: function(options) {
    if (!options.el) {
      throw new Error('`el` option must be passed to new Charts().');
      return;
    }

    this.options = options;

    this.el  = options.el;
    this.$el = $(this.el);
    this.$el.css({position: 'relative'});
  },

  _render: function() {
    var self = this;

    this.$el.html(template()).ready(function() {
      self.$root        = self.$el.find('.b-embd-chart');
      self.$area        = self.$el.find('.b-embd-chart__graph_area');
      self.$candlestick = self.$el.find('.b-embd-chart__graph_candlestick');
      self.$resize      = self.$el.find('.b-embd-chart__split-resize');
      self.$menuItems   = self.$el.find('.b-embd-chart__menu li');
      self.$valueLine   = self.$el.find('.b-embd-chart__value');
      self.$prediction  = self.$valueLine.find('.prediction');
      self.$timer       = self.$el.find('.b-embd-chart__timer');
      self.$timerValue  = self.$el.find('.b-embd-chart__timer__value');
      self.$scrollPanel  = self.$el.find('.b-embd-chart__scroll-panel');
      self.$rangePresets = self.$el.find('.b-embd-chart__ranges li');

      self._initialize();
    });
  },

  _initialize: function() {
    var self = this;

    _.bindAll(this, '_onChangeViewMode', '_onResizeHandleDrag', '_timerTick', '_onSocketPush', '_onSocketOpen', '_childGraphOnReady', '_applyRangePreset', 'zoomIn', 'zoomOut', 'scrollToEnd', 'scrollLeft', 'scrollRight');

    this.area        = new ChartBase({el: this.$area[0]});
    this.candlestick = new ChartCandlestick({el: this.$candlestick[0]});
    this.state       = {
      childGrapsWaintingCount: 2,
      splitDelta: 0,
      splitHandleX: 0,
      timer: null
    };

    this.on('changeViewMode', this._onChangeViewMode);

    this.area.$el.on('ready', this._childGraphOnReady);
    this.candlestick.$el.on('ready', this._childGraphOnReady);

    this.$menuItems.on('click', function() { self.viewMode($(this).attr('mode')) });
    this.$scrollPanel.find('.scrollToEnd').on('click', this.scrollToEnd);
    this.$scrollPanel.find('.scrollLeft').on('click', this.scrollLeft);
    this.$scrollPanel.find('.scrollRight').on('click', this.scrollRight);
    this.$scrollPanel.find('.zoomIn').on('click', this.zoomIn);
    this.$scrollPanel.find('.zoomOut').on('click', this.zoomOut);
    this.$rangePresets.on('click', this._applyRangePreset);

    this.area.on('setExtremes', function(e, extremes) {
      self._checkRangePresets(extremes.max-extremes.min);
      self._syncGraphsPositions(self.area, self.candlestick, extremes);
    });

    this.candlestick.on('setExtremes', function(e, extremes) {
      self._syncGraphsPositions(self.candlestick, self.area, extremes);
    });

    interact(this.$resize[0])
      .draggable(_.merge({}, CONFIG.INTERACT.DRAGGABLE, {restrict: {restriction: this.$resize[0].parentNode}}))
      .on('dragmove', this._onResizeHandleDrag);

    this.$el.bind('mousewheel', function(e){
      if(e.originalEvent.wheelDelta /120 > 0) {
        self.zoomIn();
      } else {
        self.zoomOut();
      }
    });
  },

  _childGraphOnReady: function() {
    this.state.childGrapsWaintingCount -= 1;
    this._checkRenderComplete();
  },

  _checkRenderComplete: function() {
    if (this.state.childGrapsWaintingCount <= 0 && this.options.onReady) {
      this.options.onReady();
    }
  },

  _splitResize: function(deltaPercents) {
    if (this.state.splitDelta == deltaPercents) {
      return;
    }
    this.state.splitDelta = deltaPercents;

    this.$area.width(50 + deltaPercents + '%');
    this.$candlestick.width(50 - deltaPercents + '%');
    this.reflow();
  },

  _onResizeHandleDrag: function (event) {
    var delta_percents;

    this.state.splitHandleX += event.dx;
    delta_percents = this.state.splitHandleX/this.$root.width() * 100;

    this._splitResize(delta_percents);
    event.target.style.webkitTransform = event.target.style.transform = 'translate(' + this.state.splitHandleX + 'px, 0px)';
  },

  _onChangeViewMode: function(event, mode) {
    var is_split = (mode == 'split') || (mode == 'split-full');
    var delta    = this.state.splitDelta;

    if (is_split) {
      this.state.splitDelta = 0;
      this._splitResize(delta);
    } else {
      this.$area.css({width: ''});
      this.$candlestick.css({width: ''});
      this.reflow();
    }

    this.area.chart.yAxis[0].update({labels: {enabled: !is_split}});
    this._updateValue();
  },

  _onSocketPush: function(event) {
    var data = JSON.parse(event.data);
    var tick = data[this.options.name];

    this.addPoint([+tick.created_at*1000, +tick.rate]);
  },

  _onSocketOpen: function(event) {
    this.state.socket.send('subscribe:' + this.options.name);
  },

  _updateYRange: function(tick) {
    this.area._updateYRange(tick);
    this.candlestick._updateYRange(tick);
  },

  _timerTick: function() {
    var timeToEnd       = this.state.dealEndTime - new Date().getTime(),
        timeToEndString = moment(timeToEnd).utcOffset(0).format("HH:mm:ss");

    if (timeToEnd < 0) {
      return this.clearTimer();
    }

    this.$timer.toggleClass('flash', timeToEnd < CONFIG.CHART.TIMER_ACTIVE_BORDER);
    this.$timerValue.text(timeToEndString);
  },

  _updateValue: function() {
    var y_data     = this.area.chart.series[0].yData,
        curr_value = y_data[y_data.length-1],
        valueTop   = this.candlestick.chart.yAxis[0].toPixels(curr_value);

    this.$valueLine
      .css({top: valueTop + 'px'});

    return this;
  },

  _applyRangePreset: function(evt) {
    var el = $(evt.target),
        range = CONFIG.CHART.RANGE_PRESETS[el.attr('data-range')];

    this._cancelRangePresets();
    el.addClass('active');

    this.setRange(range);
  },

  _cancelRangePresets: function() {
    this.$rangePresets.removeClass('active');
  },

  _checkRangePresets: function(range) {
    var preset = _.findKey(CONFIG.CHART.RANGE_PRESETS, function(item) {
      return item == range;
    });

    this._cancelRangePresets();

    if (preset) {
      this.$rangePresets.filter('[data-range="' + preset + '"]').addClass('active');
    }
  },

  _getXrange: function() {
    return this.area.state.xRange || this.candlestick.state.xRange;
  },

  _syncGraphsPositions: function(baseGraph, syncedGraph, extremes) {
    if (extremes.trigger) {
      syncedGraph.xSet({min: baseGraph.xGet('min'), max: baseGraph.xGet('max')});
      syncedGraph.chart.xAxis[0].setExtremes(extremes.min, extremes.max, true, true);
      this._updateValue();
    }
  },

  // Public methods

  on: function(name, callback) {
    this.$el.on.apply(this.$root, arguments);
  },

  emit: function(name, params) {
    this.$el.trigger.apply(this.$root, arguments);
  },

  onReady: function(callback) {
    this.options.onReady = callback;
  },

  viewMode: function(mode) {
    if (VIEW_MODES.indexOf(mode) == -1) {
      return;
    }

    this.$root
      .removeClass(VIEW_MODES.join(' '))
      .addClass(mode);

    this.reflow();
    this.emit('changeViewMode', mode);

    return this;
  },

  addPoint: function(tick) {
    this.area.addPoint(tick);
    this.candlestick.addPoint(tick);
    this._updateValue();

    return this;
  },

  setData: function(data) {
    this.area.setData(data);
    this.candlestick.setData(data);
    this._updateValue();

    return this;
  },

  setCollection: function(data) {
    var serializedData = data.map(function(tick) {
      return [+tick.created_at*1000, +tick.rate];
    });

    return this.setData(serializedData);
  },

  startListenSocket: function(socket) {
    this.state.socket = socket;

    socket.onopen    = this._onSocketOpen;
    socket.onmessage = this._onSocketPush;

    return this;
  },

  xSet: function(options, redraw) {
    this.area.xSet.apply(this.area, arguments);
    this.candlestick.xSet.apply(this.candlestick, arguments);

    return this;
  },

  ySet: function(options, redraw) {
    this.area.ySet.apply(this.area, arguments);
    this.candlestick.apply(this.candlestick, arguments);

    return this;
  },

  setRange: function(range) {
    this.area.setRange(range);
    this.candlestick.setRange(range);

    return this;
  },

  scrollLeft: function() {
    this.area.scrollLeft();
    this.candlestick.scrollLeft();

    return this;
  },

  scrollRight: function() {
    this.area.scrollRight();
    this.candlestick.scrollRight();

    return this;
  },

  zoomIn: function() {
    this.setRange(this._getXrange()/CONFIG.CHART.ZOOM_COEF);
  },

  zoomOut: function() {
    this.setRange(this._getXrange()*CONFIG.CHART.ZOOM_COEF);
  },

  scrollToEnd: function() {
    this.area.scrollToEnd();
    this.candlestick.scrollToEnd();

    return this;
  },

  setTimer: function(time) {
    this.xSet({plotLines: [_.merge({}, CONFIG.OPTIONS.TIMER_PLOT_LINE, {value: time})]});
    this.xSet({plotBands: [_.merge({}, CONFIG.OPTIONS.TIMER_PLOT_BAND, {from: time, to: time + CONFIG.CHART.TIMER_LINE_WIDTH})]});

    this.state.dealEndTime = time;

    this.clearTimer();
    this.state.timer = setInterval(this._timerTick, 1000);
    this.$timer.addClass('active');

    return this;
  },

  clearTimer: function(time) {
    clearInterval(this.state.timer);
    this.$timer.removeClass('active');

    return this;
  },

  setPrediction: function(percents, isUp) {
    this.$prediction.text(percents.toFixed(0) + '%');
    this.$valueLine.toggleClass('up', isUp);

    return this;
  },

  redraw: function() {
    this.area.redraw();
    this.candlestick.redraw();

    return this;
  },

  reflow: function() {
    this.area.chart.reflow();
    this.candlestick.chart.reflow();
  }
};

window.Charts = Charts;
