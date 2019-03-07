fetch("http://27.254.189.185:5000/api/SummarySales/")
   .then(response => response.json())
   .then(data => onSetBarChart(data))


const onSetBarChart = (data) => {
   let countOpen = [];
   let countClosed = [];

   for(let i = 0; i < data.length; i++) {
      const jsDate = new Date(Date.parse(data[i].dateFrom))
      const index = jsDate.getMonth();

      !countOpen[index] ? countOpen[index] = data[i].countOpenSTS 
      : countOpen[index] += data[i].countOpenSTS;

      !countClosed[index] ? countClosed[index] = data[i].countClosedSTS 
      : countClosed[index] += data[i].countClosedSTS;
   }

   
   var ctx = document.getElementById('myChart').getContext('2d');
   var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
         labels: ["Jan", "Feb", "Mar", "Arp", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
         datasets: [{
               label: "ปิดงาน (เที่ยว)",
               backgroundColor: 'rgb(79, 225, 255)',
               borderColor: 'rgb(79, 225, 255)',
               data: countClosed,       
               hoverBackgroundColor: 'rgb(63, 149, 211)'
         },
         {
            label: "ไม่ปิดงาน (เที่ยว)",
            backgroundColor: 'rgb(255, 142, 173)',
            borderColor: 'rgb(255, 142, 173)',
            data: countOpen,   
         }]
      },

      // Configuration options go here
      options: {
         tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': ';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
         },
         // maintainAspectRatio: false,
         scales: {
         xAxes: [{
             stacked: true,
             scaleLabel: {
               display: true,
               labelString: 'เดือน'
            }
            }],
         yAxes: [{ 
            stacked: true,
            scaleLabel: {
               display: true,
               labelString: 'เที่ยว'
            }
         }]
         },
         plugins: {
            datalabels: {
              font: function(context) {
                var width = context.chart.width;
                var size = Math.round(width / 64);
                 return {
                   size: size,
                  weight: 600
                };
              },
            }}
      }, 
      // plugins: {
      //    datalabels: {
      //       font: function(context) {
      //          var width = context.chart.width;
      //          var size = Math.round(width / 32);
      //           return {
      //             size: size,
      //            weight: 600
      //          };
      //       }
      //    }
      // }
      
   });  
   
   
   // setAboveLabel();
}

const setAboveLabel = () => {
   Chart.plugins.register({
      afterDatasetsDraw: function(chart, easing) {
          // To only draw at the end of animation, check for easing === 1
          var ctx = chart.ctx;

          chart.data.datasets.forEach(function (dataset, i) {
              var meta = chart.getDatasetMeta(i);
              if (!meta.hidden) {
                  meta.data.forEach(function(element, index) {
                      // Draw the text in black, with the specified font
                      ctx.fillStyle = 'rgb(0, 0, 0)';

                      var fontSize = 14;
                      var fontStyle = 'normal';
                      var fontFamily = 'Helvetica Neue';
                      ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                      // Just naively convert to string for now
                      var dataString = dataset.data[index].toString();

                      // Make sure alignment settings are correct
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';

                      var padding = 5;
                      var position = element.tooltipPosition();
                      ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                  });
              }
          });
      }
  });
}
