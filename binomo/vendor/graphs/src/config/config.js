var interact = require('interact');

module.exports = {
  CHART: {
    XAXIS_TICK_INTERVAL: 2 * 60 * 1000,
    XAXIS_RIGHT_PADDING: 5 * 60 * 1000,
    XAXIS_RANGE: 10 * 60 * 1000,
    TIMER_LINE_WIDTH: 50 * 1000,
    SECONDS_IN_CANDLE: 15 * 1000,
    RANGE_PRESETS: {
      minute: 60 * 1000,
      hour: 3600 * 1000,
      day: 24 * 3600 * 1000,
      month: 30 * 24 * 3600 * 1000,
      year: 365 * 24 * 3600 * 1000,
    },
    COLORS: {
      UP: '#57c580',
      DOWN: '#e57878'
    },
    ZOOM_COEF: 2,
    RANGE_PRESETS: {
      tenMinute: 10 * 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    },
    TIMER_ACTIVE_BORDER: 60 * 1000
  },

  OPTIONS: {
    TIMER_PLOT_LINE: {
      color: '#91bedb',
      width: 2,
      dashStyle: 'solid',
      zIndex: 5
    },
    VALUE_PLOT_LINE: {
      color: '#57c580',
      width: 1,
      dashStyle: 'solid',
      zIndex: 5
    },
    TIMER_PLOT_BAND: {
      color: 'rgba(145, 190, 219, 0.15)'
    }
  },

  INTERACT: {
    DRAGGABLE: {
      axis: 'x',
      snap: {
        targets: [
        interact.createSnapGrid({ x: 20, y: 20 })
        ],
        range: Infinity,
        relativePoints: [ { x: 0, y: 0 } ]
      },
      restrict: {
        restriction: {},
        elementRect: { top: 0, left: 0, bottom: 0, right: 0},
        endOnly: true
      }
    }
  }
};
