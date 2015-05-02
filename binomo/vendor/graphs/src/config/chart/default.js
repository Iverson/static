var CONFIG = require('../config.js');

module.exports = {
  chart: {
    backgroundColor: null,
    spacing: [0, 0, 0, 0],
    margin: [0, 0, 0, 0],
    plotBorderWidth: 0,
    borderColor: "#bfbfbf",
    events: {},
    // animation: {
    //   duration: 400,
    //   // easing: 'ease-out'
    // }
  },

  navigator: {
    // enabled: false,
    height: 68,
    margin: 0,
    xAxis: {
      labels: {
        enabled: false
      },
      ordinal: true
    },
    adaptToUpdatedData: false
  },

  scrollbar: {
    enabled: false
  },

  credits: {
    enabled: false
  },

  rangeSelector : {
    enabled: false,
    inputEnabled: false,
    buttonSpacing: 0,
    buttons: [{
      type: 'minute',
      count: 1,
      text: '1 мин'
    }, {
      type: 'hour',
      count: 1,
      text: '1 час'
    }, {
      type: 'day',
      count: 1,
      text: '1 день'
    }, {
      type: 'month',
      count: 1,
      text: '1 мес'
    }, {
      type: 'year',
      count: 1,
      text: '1 год'
    }],
    buttonTheme: {
      fill: '#ededed',
      stroke: 'none',
      'stroke-width': 0,
      style: {
        color: '#000',
        fontFamily: 'Lucida Grande',
        fontSize: '8px',
        height: '20px',
        lineHeight: '19px',
        fontWeight: 'normal'
      },
      states: {
        hover: {
        },
        select: {
          fill: '#c0c1c3',
          style: {
            fontWeight: 'normal'
          }
        }
      }
    },
    labelStyle: {
      fontSize: '0px'
    }
  },

  title : {
  },

  xAxis: {
    title: "",
    lineWidth: 0,
    // tickInterval: CONFIG.CHART.XAXIS_TICK_INTERVAL,
    range: CONFIG.CHART.XAXIS_RANGE,
    minRange: 60 * 1000,
    tickPosition: 'inside',
    offset: -22,
    ordinal: false,
    minPadding: 0.1,
    maxPadding: 0.2,
    gridLineWidth: 1,
    gridLineColor: 'rgba(0, 0, 0, 0.07)',
    showFirstLabel: true,
    showLastLabel: true,
    endOnTick: false,
    type: "datetime",
    labels: {
      style: {
        color:"rgba(0, 0, 0, 0.7)",
        fontFamily: 'Lucida Grande',
        fontSize: '8px'
      },
      overflow: "justify"
    },
    events: {}
  },

  yAxis : {
    title: "",
    showFirstLabel: false,
    showLastLabel: true,
    gridLineWidth: 1,
    gridLineColor: 'rgba(0, 0, 0, 0.07)',
    tickLength: 25,
    tickAmount: 16,
    offset: -20,
    minPadding: 0,
    maxPadding: 0,
    labels: {
      align: 'right',
      style: {
        color:"rgba(0, 0, 0, 0.7)",
        fontFamily: 'Lucida Grande',
        fontSize: '8px'
      },
      overflow: "justify",
      formatter: function () {
        return this.value.toFixed(5);
      }
    },
    events: {}
  },

  tooltip: {
    enabled: false,
    formatter: function() {
      return Highcharts.dateFormat("%Y:%m:%d %H:%M:%S", this.x) + ": <strong>" + this.y.toFixed(6) + "</strong>"
    }
  },

  legend: {
    enabled: false
  },

  series: [{
    pointInterval: 1e3,
    data: []
  }]
};
