const getSummarySales = () => {
   return fetch("http://27.254.189.185:5000/api/SummarySales/")
            .then(response => response.json())
}

const getBudget = () => {
   return fetch("http://27.254.189.185:5000/api/SummarySales/BudgetAmount")
            .then(response => response.json())
}

const getSalesAndBudget = () => {
   return Promise.all([getSummarySales(), getBudget()]);
}

getSalesAndBudget()
   .then(([getSummarySales, getBudget]) => {
      onSetComboChart(getSummarySales, getBudget);
   })

const onSetComboChart = (salesData, budgetData) => {
   let sumOpen = [];
   let sumClosed  = [];
   let budget = [];

   for(let i = 0; i < salesData.length; i++) {
      const jsDate = new Date(Date.parse(salesData[i].dateFrom))
      const index = jsDate.getMonth();

      !sumOpen[index] ? sumOpen[index] = salesData[i].sumOpenSTS
      : sumOpen[index] += salesData[i].sumOpenSTS

      !sumClosed[index] ? sumClosed[index] = salesData[i].sumClosedSTS
      : sumClosed[index] += salesData[i].sumClosedSTS
   }

   console.log(sumClosed)

   budgetData.forEach((element, index) => {
      budget[index] = element.budget_Amount
   });

   var ctx = document.getElementById('myChart').getContext('2d');
   var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
         labels: ["Jan", "Feb", "Mar", "Arp", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
         datasets: [{
               label: "ปิดงาน (มูลค่า)",
               backgroundColor: 'rgb(79, 225, 255)',
               borderColor: 'rgb(79, 225, 255)',
               data: sumClosed,       
               hoverBackgroundColor: 'rgb(63, 149, 211)'
               // pointHoverBackgroundColor: 'rgb(63, 149, 211)'
         },
         {
            label: "ไม่ปิดงาน (มูลค่า)",
            backgroundColor: 'rgb(255, 142, 173)',
            borderColor: 'rgb(255, 142, 173)',
            data: sumOpen,

            // pointHoverBackgroundColor: 'red'
         },
         {
            label: "Budget",
            fill: false,
            // backgroundColor: 'rgb(255, 211, 211)',
            // borderColor: 'rgb(255, 211, 211)',
            data: budget,
            type: 'line'
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
         // responsive: true,
         // maintainAspectRatio: false,
         scales: {
         xAxes: [{ 
            stacked: true,
            scaleLabel: {
               display: true,
               labelString: 'เดือน'
            }
         }],
         yAxes: [
            { 
               stacked: true,
               ticks: {
                  // Include a dollar sign in the ticks
                   callback: function(value, index, values) {
                      return numFormatter(value, 0);
                  }
               },
               scaleLabel: {
                  display: true,
                  labelString: 'มูลค่า'
               }
            }
         ]
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
              formatter: function(value) {
               return numFormatter(value, 1)
             }
            }
         },
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
}

const numFormatter = (num, toFix) => {
    return num >= 1000000 ? (num/1000000).toFixed(toFix) + 'M'
         : num > 999 ? (num/1000).toFixed(1) + 'K' : num
}

const numberWithCommas = (num) => {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}