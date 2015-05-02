var _                   = require('lodash');
var CONFIG              = require('../config/config.js');
var DEFAULT_OPTIONS     = require('../config/chart/default.js');
var AREA_OPTIONS        = require('../config/chart/area.js');
var template            = require('../templates/graph_base.html');

var ChartBase = function(options) {
  this.el  = options.el;
  this.$el = $(this.el);

  this._configure(options);
  this._render();
};

ChartBase.prototype = {
  _configure: function(options) {
    this.options = _.merge({}, DEFAULT_OPTIONS, AREA_OPTIONS);
  },

  _render: function() {
    var self = this;

    this.$el.html(template()).ready(function() {
      self.options.chart.renderTo = self.$el.find('.b-embd-chart__graph__placeholder')[0];

      self._initialize();
      self.$el.trigger('ready');
    });
  },

  _initialize: function() {
    _.bindAll(this, '_onXExtremesUpdate');

    this.options.xAxis.events.setExtremes = this._onXExtremesUpdate;
    // this.options.yAxis.events.setExtremes = this._onYExtremesUpdate;
    this.options.chart.events.redraw = this._onRedraw;
    this.chart = new Highcharts.StockChart(this.options);

    this.state = {
      endSticked: true,
      xRange: CONFIG.CHART.XAXIS_RANGE
    };
  },

  _getStartTime: function() {
    return this.chart.xAxis[0].options.min;
  },

  _getEndTime: function() {
    return this.chart.xAxis[0].getExtremes().dataMax + this.state.xRange/2;
  },

  _onXExtremesUpdate: function(e) {
    this.state.endSticked = (e.max == this._getEndTime());

    this.emit('setExtremes', e);
  },

  _onYExtremesUpdate: function(e) {
  },

  _onRedraw: function(e) {
  },

  _updateYRange: function(tick) {
    var extremes = {min: tick[1].toFixed(4), max: tick[1].toFixed(4)};
    this.ySet(extremes);
  },

  _updateXTickInterval: function(range) {
    this.xSet({tickInterval: +(CONFIG.CHART.XAXIS_TICK_INTERVAL*range/CONFIG.CHART.XAXIS_RANGE).toFixed(0)}, false, false);
  },

  _setXAxisEndPadding: function() {
    var extremes = this.chart.xAxis[0].getExtremes();
    var max, min,
        x_data = this.chart.series[0].xData;

    max = x_data[x_data.length-1] + this.state.xRange/2;
    min = max - this.state.xRange;
    min = min < x_data[0] ? x_data[0] : min;

    if (max >= (this.xGet('max') || this._getEndTime())) {
      // this.xSet({max: max});


      if (this.state.endSticked) {
        this.scrollToEnd();
      }
    }
  },

  on: function(name, callback) {
    this.$el.on.apply(this.$el, arguments);
  },

  emit: function(name, params) {
    this.$el.trigger.apply(this.$el, arguments);
  },

  addPoint: function(tick) {
    this.chart.series[1].addPoint(tick, false, false);
    this.chart.series[0].addPoint(tick, true, true);
    this.updateLastTick();
  },

  setData: function(data) {
    this.chart.series[1].setData(data, false, false);
    this.chart.series[0].setData(data, true, true);
    this.updateLastTick();

    return this;
  },

  updateLastTick: function() {
    // this._updateYRange(tick);
    this._setXAxisEndPadding();
  },

  xGet: function(name) {
    return this.chart.xAxis[0].options[name];
  },

  yGet: function(name) {
    return this.chart.yAxis[0].options[name];
  },

  xSet: function(options, redraw) {
    this.chart.xAxis[0].update.apply(this.chart.xAxis[0], arguments);

    return this;
  },

  ySet: function(options, redraw) {
    this.chart.yAxis[0].update.apply(this.chart.yAxis[0], arguments);

    return this;
  },

  scrollTo: function(time) {
    var min = time < this._getStartTime() ? this._getStartTime() : time,
        max = min + this.state.xRange;

    this.chart.xAxis[0].setExtremes(min, max, true, true);

    return this;
  },

  scrollToEnd: function() {
    this.state.endSticked = true;
    this.scrollTo(this._getEndTime() - this.state.xRange);
  },

  scrollLeft: function() {
    var extremes = this.chart.xAxis[0].getExtremes();

    this.state.endSticked = false;
    this.scrollTo(extremes.min - this.state.xRange/2);
  },

  scrollRight: function() {
    var extremes = this.chart.xAxis[0].getExtremes();

    if (extremes.min + 1.5*this.state.xRange > this._getEndTime()) {
      this.scrollToEnd();
    } else {
      this.scrollTo(extremes.min + this.state.xRange/2);
    }
  },

  setRange: function(range) {
    var extremes   = this.chart.xAxis[0].getExtremes(),
        currRange  = extremes.max - extremes.min,
        center     = extremes.min + currRange/2,
        min        = center-range/2,
        max        = min+range,
        xOptions   = {};

    if (min < extremes.dataMin) {
      xOptions.min = min;
    }

    if (max > extremes.dataMax) {
      xOptions.max = max;
    }

    if (xOptions.max || xOptions.min) {
      this.xSet(xOptions);
    }

    this.chart.xAxis[0].setExtremes(min, min+range, true, true);
    // this._updateXTickInterval(range);
    this.state.xRange = range;

    this.state.endSticked = false;
  },

  redraw: function() {
    try {
      this.chart.redraw();
    } catch(err) {
      console.log(err);
      this.redraw();
    }

    return this;
  }
};

ChartBase.prototype.constructor  = ChartBase;

module.exports = ChartBase;
