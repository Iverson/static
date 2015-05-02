module.exports = {
  chart: {
    type: 'area',
  },
  
  plotOptions: {
    area: {
      marker: {
        enabled: false
      },
      shadow: false,
      states: {
        hover: {
          enabled: false
        }
      },
      threshold: null,
      enableMouseTracking: true,
      cropThreshold: 1e3,
      lineColor: "rgba(0, 0, 0, 0.2)",
      fillColor: "rgba(0, 0, 0, 0.2)",
      lineWidth: 0
    },
    series: {
      point: {
        events: {}
      }
    }
  }
};
