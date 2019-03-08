// Global variable
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//-----

// HTTP requets
// const getByTod = (year) => {
//    return fetch(`http://27.254.189.185:5000/api/get/mis/${year}`)
//       .then(response => response.json());
// }

const getAllTod = () => {
   return fetch(`http://27.254.189.185:5000/api/get/mis/tod`)
      .then(response => response.json());
}

// const getByTodAndAllTod = (year) => {
//    return Promise.all([getByTod(year), getAllTod()]);
// }

const getPlan = (year) => {
   return fetch(`http://27.254.189.185:5000/api/get/mis/plan/${year}`)
      .then(response => response.json())
}

const getActual = (year) => {
   return fetch(`http://27.254.189.185:5000/api/get/mis/act/${year}`)
      .then(response => response.json())
}

const getPlanActualAndAllTod = (year) => {
   return Promise.all([getPlan(year), getActual(year), getAllTod()]);
}
//-----

const onChangeYear = (year) => {
   openLoader();

   // getByTodAndAllTod(year)
   //    .then(([byTodData, allTodData]) => createReportTable(byTodData, allTodData));
   
   getPlanActualAndAllTod(year)
   .then(([planData, actualData, allTodData]) => {
      const byTodData = mergePlanAndActual(planData, actualData);

      createReportTable(byTodData, allTodData);
   })
}

const createReportTable = (byTodData, allTodData) => {
   setTableHead(byTodData);
   setTableBody(byTodData, allTodData);

   closeLoader();
}

const setTableHead = (byTodData) => {
   const selectedYear = document.querySelector('#select-year').value;
   const reportTableHead = document.querySelector('thead');

   let tableHead = '';

   tableHead += `
                  <tr>
                     <th class='align-middle' rowspan='2'>
                        ${selectedYear}
                     </th>
               `;

   // loop through for set months
   byTodData.forEach(byTodEle => {
      tableHead += `
                    <th colspan='2'>
                        ${monthNames[byTodEle.iMonth - 1]}
                    </th> 
                  `;
   });

   tableHead += '</tr><tr>';

   // set head plan & actual for each month
   byTodData.forEach(() => {

      tableHead += `
                     <th>Plan</th>                  
                     <th>Actual</th>
                  `;
   });

   tableHead += '</tr>';

   reportTableHead.innerHTML = tableHead;
}

const setTableBody = (byTodData, allTodData) => {
   const reportTableBody = document.querySelector('tbody');
   let tableBody = '';
   let selectYear = document.querySelector('#select-year').value;
   const date = new Date();
   const currentYear = date.getFullYear();
   // console.log("currentYear", currentYear)
   // console.log("selectYear", selectYear)

   allTodData.forEach(allTodEle => {
      const tod = allTodEle.sTod;

      // set tod before loop each month
      tableBody += `<tr>
                     <td style="font-weight:bold;">${tod}</td>
                  `;

      // loop each month for get tod detail                  
      byTodData.forEach((byTodEle, index) => {
         const todDetail = byTodEle.detail.filter(ele => ele.sTodList === tod);
         // console.log(index)
         // const date = new Date();
         // const currentYear = date.getFullYear();
         // console.log(currentYear)

         tableBody += `
                        <td align="right" class="${(todDetail.length && !index && selectYear == currentYear) ? 'bg-primary text-white' : ''}">
                           ${
                              todDetail.length 
                              ? (todDetail[0].fPlan ? numberWithCommas((todDetail[0].fPlan).toFixed(0)) : '-')
                              : '-'
                           }
                        </td>
                        <td align="right" class="${(todDetail.length && !index && selectYear == currentYear) ? (todDetail[0].fAct >= todDetail[0].fPlan ? 'bg-success text-white' 
                                    : 'bg-danger text-white') : ''}">
                           ${
                              todDetail.length
                              ? (todDetail[0].fAct ? numberWithCommas((todDetail[0].fAct).toFixed(0)) : '-')
                              : '-'
                           }
                        </td>
                     `;
      
      })

      tableBody += '</tr>';
   })

   reportTableBody.innerHTML = tableBody;
}

const mergePlanAndActual = (planData, actualData) => {
   let byTodData = planData;

   for(let i = 0; i < byTodData.length; i++) {
      const actualMonthData = actualData.filter(ele => ele.iMonth === byTodData[i].iMonth);

      for(let j = 0; j < byTodData[i].detail.length; j++) {
         const actualTodData = actualMonthData[0].detail.filter(ele => ele.sTodList === byTodData[i].detail[j].sTodList);
         actualTodData.length ? byTodData[i].detail[j] = Object.assign({}, byTodData[i].detail[j], actualTodData[0]) : null;
      }
   }
   
   return byTodData;
}

const setSelectYear = () => {
   const startYear = 2018;
   const date = new Date();
   const year = date.getFullYear();
   let selectYear = '';

   for (let i = startYear; i <= year; i++) {
      selectYear += `<option value=${i} ${i === year ? 'selected' : null}>${i}</option>`;
   }

   document.querySelector('#select-year').innerHTML += selectYear;
}

const startPage = () => {
   const selectYear = document.querySelector('#select-year').value;
   onChangeYear(selectYear);
}

// const numFormatter = (num, toFix = 0) => {
//    return num >= 1000000 ? (num / 1000000).toFixed(toFix) + 'M'
//       : num > 999 ? (num / 1000).toFixed(toFix) + 'K' : num;
// }

const numFormatter = (num, toFix = 0) => {
   return num > 999 ? (num / 1000).toFixed(toFix) + 'K' : num;
}

const numberWithCommas = (num) => {
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const openLoader = () => {
   // open loader
   document.querySelector('#report-table').style.display = 'none';
   document.querySelector('#loader').style.display = 'block';
}

const closeLoader = () => {
   // close loader
   document.querySelector('#report-table').style.display = 'table';
   document.querySelector('#loader').style.display = 'none';
}

const getCurrentDate = () => {
   const date = new Date();
   date.setDate(date.getDate() - 1);

   let dd = date.getDate();
   let mm = date.getMonth() + 1;
   let yyyy = date.getFullYear();

   dd = (dd < 10) ? '0' + dd : dd;
   mm = (mm < 10) ? '0' + mm : mm;

   return dd + '' + mm + '' + yyyy;
}

const getDateExcelName = (selectYear) => {
   // const checkYear = (new Date()).getFullYear();
   // const dateFrom = '0101' + selectYear;
   // const dateTo = selectYear < checkYear ? '3112' + selectYear : getCurrentDate();

   // return dateFrom + 'To' + dateTo;

   return selectYear;
}

const setExcelName = (selectYear) => {
   return 'SalesByTOD_' + getDateExcelName(selectYear);
}


const exportToExcel = () => {
   const selectYear = document.querySelector('#select-year').value;

   const excelName = setExcelName(selectYear);

   if (!selectYear) {
      Swal.fire({
         type: 'warning',
         title: !selectYear ? 'โปรดเลือกปี' : null,
         text: '',
      })
   } else {
      let tab_text = "<table border='2px'><tr>";
      let j = 0;
      tab = document.getElementById('report-table');

      for (j = 0; j < tab.rows.length; j++) {
         tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
      }

      tab_text = tab_text + "</table>";
      tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");
      tab_text = tab_text.replace(/<img[^>]*>/gi, "");
      tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, "");

      let ua = window.navigator.userAgent;
      let msie = ua.indexOf("MSIE ");

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
         txtArea1.document.open("txt/html", "replace");
         txtArea1.document.write(tab_text);
         txtArea1.document.close();
         txtArea1.focus();
         sa = txtArea1.document.execCommand("SaveAs", true, `${excelName}.xls`);
      }
      else {
         //   sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  
         sa = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
         saveAs(sa, `${excelName}.xls`);
      }

      return (sa);
   }
}

const saveAs = (uri, filename) => {
   var link = document.createElement('a');
   if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
   } else {
      window.open(uri);
   }
}
// -----

setSelectYear();
startPage();
// JQuery Add Col and Row
// const addColume = () => {
//    $('tbody tr').each(function(){
//      $(this).append(`<td>${c}</td>`);
//   })
//   c++;
// }

// const addRowToBody = () => {
// $('#report-table tbody').append(`<tr></tr>`);
// }