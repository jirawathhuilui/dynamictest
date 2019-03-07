// GLOBAL VARIABLE 
// -----
const monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"
];
// -----

// HTTP REQUEST
// -----
const getReport = (month, year) => {
   return fetch(`http://27.254.189.185:90/api/cotruck/report/${year}/${month}`)
      .then(response => response.json())
}
// -----

// GET FUNCTION
// -----
const getMasterAndReportByMonth = (selectMonth = 0) => {
   document.querySelector('#report-table').style.display = 'none';
   document.querySelector('#loader').style.display = 'block';

   const year = document.querySelector('#year').value;
   let month = selectMonth;

   if (month === 0) {
      const d = new Date();
      month = d.getMonth() + 1;
   }

   getReport(month, year).then(master => {
      setTableBody(master, month)
      setDate(month, year);
   });
}

const getNoneResult = (masterResult, month) => {
   let date = new Date();
   let todayMinusOne;

   if (month < date.getMonth() + 1) {
      date = new Date(date.getFullYear(), month, 0);
      todayMinusOne = date.getDate();
   } else {
      todayMinusOne = date.getDate() - 1;
   }

   const countDate = masterResult.count.length ? masterResult.count[0].countDate : 0;
   const sumReason = masterResult.countStatus.length ? masterResult.countStatus[0].sumReason : 0;
   const noneResult = (todayMinusOne - countDate) - sumReason;

   return noneResult;
}

const getKPIColor = (master) => {
   let color = '';
   if (master.count.length) {
      color = master.iKpi > master.count[0].countSOID ? "bg-danger text-white bold" : null
   } else {
      color = "bg-danger text-white bold"
   }

   return color;
}
// -----

// SET FUNCTION
// -----
const setTableBody = (master, month) => {
   let tableBody = '';
   let kpiColor = '';

   for (let i = 0; i < master.length; i++) {
      tableBody += `<tr>
               <td>${master[i].sSite}</td>
               <td>${master[i].sLPnumber}</td>
               <td>${master[i].sTruckType}</td>
               <td class="text-light bg-primary">${master[i].iKpi}</td>`

      let noneResult = '';

      noneResult = getNoneResult(master[i], month);

      kpiColor = getKPIColor(master[i]);

      if (master[i].countStatus.length) {
         tableBody += `<td class="${kpiColor}">${master[i].count.length ? master[i].count[0].countSOID : '-'}</td>
                  <td>${noneResult && noneResult >= 0 ? noneResult : '-'}</td>
                  <td>${master[i].countStatus[0].scontinue ? master[i].countStatus[0].scontinue : '-'}</td>
                  <td>${master[i].countStatus[0].workleave ? master[i].countStatus[0].workleave : '-'}</td>
                  <td>${master[i].countStatus[0].vacationleave ? master[i].countStatus[0].vacationleave : '-'}</td>
                  <td>${master[i].countStatus[0].waiting ? master[i].countStatus[0].waiting : '-'}</td>
                  <td>${master[i].countStatus[0].repair ? master[i].countStatus[0].repair : '-'}</td>
                  <td>${master[i].countStatus[0].none ? master[i].countStatus[0].none : '-'}</td>`
      } else {
         tableBody += `<td class="${kpiColor}">${master[i].count.length ? master[i].count[0].countSOID : '-'}</td>
                  <td>${noneResult && noneResult >= 0 ? noneResult : '-'}
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>`
      }

      tableBody += '</tr>';
   }

   document.querySelector('#table-body').innerHTML = tableBody;

   document.querySelector('#report-table').style.display = 'table';
   document.querySelector('#loader').style.display = 'none';
}

const setSelectYear = () => {
   const startYear = 2018;
   const date = new Date();
   const year = date.getFullYear();
   let selectYear = '';

   for (let i = startYear; i <= year; i++) {
      selectYear += `<option value=${i} ${i === year ? 'selected' : null}>${i}</option>`;
   }

   document.querySelector('#year').innerHTML += selectYear;

   setSelectMonth(year);
}

const setSelectMonth = (year) => {
   const filterDate = new Date();
   const filterYear = filterDate.getFullYear();
   let filterMonth = (year == filterYear ? filterDate.getMonth() + 1 : 12);

   let selectMonth = "<option selected value='0' disabled>Select Month</option>";

   for (let i = 1; i <= filterMonth; i++) {
      selectMonth += `<option value=${i}>${i < 10 ? '0' + i : i} ${monthNames[i - 1]}</option>`;
   }

   document.querySelector('#month').innerHTML = selectMonth;
}

const setDate = (month, selectYear) => {
   let date = new Date();
   let year = selectYear;
   const dateFrom = '1';
   let dateTo = '';

   if (month < date.getMonth() + 1 || selectYear < date.getFullYear()) {
      date = new Date(year, month, 0);
      dateTo = date.getDate();
      year = date.getFullYear();
   } else {
      dateTo = date.getDate() - 1;
   }

   document.querySelector('#date').innerHTML = `Month: ${year}, ${monthNames[month - 1]} (${dateFrom} ถึง ${dateTo})`;
}
// -----

// CALL WHEN JAVASCRIPT OR PAGE IS LOAD
// -----
window.onload = () => {
   setSelectYear();
   getMasterAndReportByMonth();
}
// -----