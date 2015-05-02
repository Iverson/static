var _                   = require('lodash');
var CONFIG              = require('../config/config.js');
var DEFAULT_OPTIONS     = require('../config/chart/default.js');
var CANDLESTICK_OPTIONS = require('../config/chart/candlestick.js');
var template            = require('../templates/graph_base.html');
var ChartBase           = require('./ChartBase.js');

var ChartCandlestick = function(options) {
  this.constructor.__supper__.constructor.apply(this, arguments);
};

ChartCandlestick.prototype              = Object.create(ChartBase.prototype);
ChartCandlestick.prototype.constructor  = ChartCandlestick;
ChartCandlestick.__supper__             = ChartBase.prototype;

ChartCandlestick.prototype._configure = function(options) {
  this.options = _.merge({}, DEFAULT_OPTIONS, CANDLESTICK_OPTIONS);
},

ChartCandlestick.prototype.setData = function(data) {
  var length = data.length,
      candles = [],
      curr_candle, tick;

  this.state.currCandleTime = null;

  for (var i = 0; i < length; i++) {
    tick = data[i];
    curr_candle = candles[candles.length - 1] || [];

    if (this._isCurrCandleActual(tick[0])) {
      candles[candles.length - 1] = this._addPointToCandle(curr_candle, tick);
    } else {
      this.state.currCandleTime = tick[0];
      candles.push([tick[0], curr_candle[4] || tick[1], tick[1], tick[1], tick[1]]);
    }
  }

  this.chart.series[1].setData(candles, false, false);
  this.chart.series[0].setData(candles, true, true);
  this.updateLastTick();

  return this;
};

ChartCandlestick.prototype.addPoint = function(tick) {
  var point;
  candles       = this.chart.series[0].data,
  candles_nav   = this.chart.series[1].data,
  candles_y     = this.chart.series[0].yData,
  curr_candle   = candles[candles.length - 1],
  curr_candle_nav = candles_nav[candles.length - 1],
  curr_candle_y = candles_y[candles_y.length - 1] || [];

  if (this._isCurrCandleActual(tick[0])) {
    point     = this._addPointToCandle([curr_candle.x].concat(curr_candle_y), tick);

    curr_candle_nav.update(point, true, true);
    curr_candle.update(point, true, true);
  } else {
    this.state.currCandleTime = tick[0];
    point = [tick[0], curr_candle_y[3] || tick[1], tick[1], tick[1], tick[1]];
    this.chart.series[1].addPoint(point, true, true);
    this.chart.series[0].addPoint(point, true, true);
  }

  this.updateLastTick();

  return this;
};

ChartCandlestick.prototype._isCurrCandleActual = function(time) {
  return this.state.currCandleTime && time <= this.state.currCandleTime + CONFIG.CHART.SECONDS_IN_CANDLE;
};

ChartCandlestick.prototype._addPointToCandle = function(candle, tick) {
  return [candle[0], candle[1], Math.max(candle[2], tick[1]), Math.min(candle[3], tick[1]), tick[1]];
};

module.exports = ChartCandlestick;
