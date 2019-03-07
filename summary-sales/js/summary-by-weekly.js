fetch("http://27.254.189.185:90/api/SummarySales/")
   .then(response => response.json())
   .then(data => {
      onSetWeekly(data);
      setHead(data);
   })

const onSetWeekly = (data) => {
   let weekArr = setWeekArr(data);
   let weeklyCreate = "";

   for(let i = weekArr.length-1; i >=0; i--){
      weeklyCreate += ` <div class="row">
                           <div class="col-2">
                              <h6 class="${i === weekArr.length-1 ? 'bg-danger': 'bg-light-red'}">Week</h6>
                              <p>${weekArr[i].week}</p>
                           </div> 
                           <div class="col-3">
                              <h6 class="${i === weekArr.length-1 ? 'bg-danger': 'bg-light-red'}">DateFrom</h6>
                              <p>${weekArr[i].dateFrom}</p>
                           </div> 
                           <div class="col-3">
                              <h6 class="${i === weekArr.length-1 ? 'bg-danger': 'bg-light-red'}">DateTo</h6>
                              <p>${weekArr[i].dateTo}</p>
                           </div> 
                           <div class="col-2">
                              <h6 class="${i === weekArr.length-1 ? 'bg-danger': 'bg-light-red'}">Sum(T)</h6>
                              <p>${weekArr[i].sumTrip}</p>
                           </div> 
                           <div class="col-2">
                              <h6 class="${i === weekArr.length-1 ? 'bg-danger': 'bg-light-red'}">S.Act.(B)</h6>
                              <p>${weekArr[i].sumActual}</p>
                           </div>   

                           <div class="col-6 text-left text-danger">
                              <p>เที่ยวปิดงาน: <span>${weekArr[i].countOpen}</span></p>
                              <p>เที่ยวไม่ปิดงาน: <span>${weekArr[i].countClosed}</span></p>
                           </div>
                           <div class="col-6 text-left text-danger">
                              <p>มูลค่าปิดงาน: <span>${weekArr[i].sumOpen}</span></p>
                              <p>มูลค่าไม่ปิดงาน: <span>${weekArr[i].sumClosed}</span></p>
                           </div>
                        </div>
                        <hr>`;
   }
   document.querySelector("#weekly").innerHTML = weeklyCreate;
}

const setHead = (dataArr) => {

   const d = new Date();
   const n = d.getMonth()+1;
   let month = "";
   let dateFrom = "";
   let dateTo = "";
   let sumTrip = 0;
   let sumAct = 0;
   let tripClosed = 0;
   let tripOpen = 0;
   let actClosed = 0;
   let actOpen = 0;

   let data = dataArr.filter(element => element.monthofYear === n);

   
   for(let i = 0; i < data.length; i++) {
      // if(data[i].monthofYear === n) {
      const dateFromJs = new Date(Date.parse(data[i].dateFrom));
      const dateToJs = new Date(Date.parse(data[i].dateTo));
      month = data[i].monthofYear;
      i === 0 ? dateFrom = dateFormat(dateFromJs) : null;
      i+1 === data.length ? dateTo = dateFormat(dateToJs) : null;
      sumTrip += data[i].countAllSTS;
      sumAct += data[i].sumAllSTS;
      tripClosed += data[i].countClosedSTS;
      tripOpen += data[i].countOpenSTS;
      actClosed += data[i].sumClosedSTS;
      actOpen += data[i].sumOpenSTS;
      // }
   }

   document.querySelector("#month").innerHTML = month; 
   document.querySelector("#date-from").innerHTML = dateFrom; 
   document.querySelector("#date-to").innerHTML = dateTo; 
   document.querySelector("#summary-trip").innerHTML = numberWithCommas(numFormatter(sumTrip, 1)); 
   document.querySelector("#summary-actual").innerHTML = numberWithCommas(numFormatter(sumAct, 1)); 
   document.querySelector("#trip-closed").innerHTML = numberWithCommas(numFormatter(tripClosed, 1)); 
   document.querySelector("#trip-open").innerHTML = numberWithCommas(numFormatter(tripOpen, 1)); 
   document.querySelector("#act-closed").innerHTML = numberWithCommas(numFormatter(actClosed, 1)); 
   document.querySelector("#act-open").innerHTML = numberWithCommas(numFormatter(actOpen, 1));
}

const setWeekArr = (data) => {
   // const date = new Date();
   let weekArr = [];
   // let weekObj = {
   //    week: '',
   //    dateFrom: '',
   //    dateTo: '',
   //    sumTrip: '',
   //    sumActual: '',
   //    sumOpen: '',
   //    sumClosed: '',
   //    countOpen: '',
   //    countClosed: ''
   // };
   var d = new Date();
   var n = d.getMonth() + 1;
   console.log(n)
   const filterArr = data.filter(element => element.monthofYear === n)

   filterArr.forEach(element => {
      let weekObj = {}
      const dateFrom = new Date(Date.parse(element.dateFrom));
      const dateTo = new Date(Date.parse(element.dateTo));
      weekObj.month = element.monthofYear;
      weekObj.week = element.weekofYear;
      weekObj.dateFrom = dateFormat(dateFrom);
      weekObj.dateTo = dateFormat(dateTo);
      weekObj.sumTrip = numberWithCommas(numFormatter(element.countAllSTS, 1));
      weekObj.sumActual = numberWithCommas(numFormatter(element.sumAllSTS, 1));
      weekObj.sumOpen = numberWithCommas(numFormatter(element.sumOpenSTS, 1));
      weekObj.sumClosed = numberWithCommas(numFormatter(element.sumClosedSTS, 1));
      weekObj.countOpen = numberWithCommas(numFormatter(element.countOpenSTS, 1));
      weekObj.countClosed = numberWithCommas(numFormatter(element.countClosedSTS, 1));
      weekArr.push(weekObj);
   })

   return weekArr;
}

const dateFormat = (dateInput) => {
   let date = dateInput;
   let dd = date.getDate();
   let mm = date.getMonth() + 1; //January is 0!
   let yyyy = date.getFullYear();

   if (dd < 10) {
   dd = '0' + dd;
   }

   if (mm < 10) {
   mm = '0' + mm;
   }

   date = dd + '/' + mm + '/' + yyyy;
   return date
}

const numFormatter = (num, toFix=0) => {
   return num >= 1000000 ? (num/1000000).toFixed(toFix) + 'M'
        : num > 999 ? (num/1000).toFixed(1) + 'K' : num
}

const numberWithCommas = (num) => {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}