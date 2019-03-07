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
      onSetAllTxt(getSummarySales, getBudget);
   })

const onSetAllTxt = (salesData, budgetData) => {
   const summaryPlanTxt = document.querySelector('#summary-plan-txt'),
      actualTxt = document.querySelector('#actual-txt'),
      progressTxt = document.querySelector('#progress-txt'),
      diffAmonuntTxt = document.querySelector('#diff-amount-txt'),
      remainTxt = document.querySelector('#remain-txt')
   
   let summaryPlan  = 0;
   let actual = 0;
   let diffAmount = 0;

   salesData.forEach((element) => {
      actual += element.sumAllSTS
   })

   budgetData.forEach((element, index) => {
      summaryPlan += element.budget_Amount
   });
   
   diffAmount = summaryPlan - actual;

   summaryPlanTxt.innerHTML = numberWithCommas(numFormatter(summaryPlan, 1))
   actualTxt.innerHTML = numberWithCommas(numFormatter(actual, 1))
   diffAmonuntTxt.innerHTML = numberWithCommas(numFormatter(diffAmount, 1))
   progressTxt.innerHTML = (actual/summaryPlan * 100).toFixed(1) + "%"
   remainTxt.innerHTML = (diffAmount/summaryPlan * 100).toFixed(1) + "%"
}

const numFormatter = (num, toFix=0) => {
   return num >= 1000000 ? (num/1000000).toFixed(toFix) + 'M'
        : num > 999 ? (num/1000).toFixed(1) + 'K' : num
}

const numberWithCommas = (num) => {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}