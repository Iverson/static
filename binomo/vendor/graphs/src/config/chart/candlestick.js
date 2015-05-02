module.exports = {
  series : [{
    type : 'candlestick',
    data : []
  }],

  plotOptions: {
    candlestick: {
      dataGrouping: {
        enabled: false
      },
      // groupPadding: 0.1,
      fillOpacity: .7,
      marker: {
        enabled: false
      },
      shadow: false,
      color: '#e57878',
      upColor: '#57c580',
      lineColor: '#e57878',
      upLineColor: '#57c580',
      lineWidth: 1,
      states: {
        hover: {
          enabled: false
        }
      },
      threshold: null,
      enableMouseTracking: true,
      cropThreshold: 1e3,
    },
    series: {
      point: {
        events: {}
      }
    }
  }
};
