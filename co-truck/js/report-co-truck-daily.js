// GLOBAL VARIABLE 
// -----
const monthNames = ["January", "February", "March", "April", "May", "June",
   "July", "August", "September", "October", "November", "December"
];

let excelName = '';

let master = [];
let shipment = [];
let status = [];
// -----

// Fetch API
// -----
const getMaster = () => {
  return fetch('http://27.254.189.185:90/api/cotruck/lp_number')
    .then(response => response.json())
}

const getShipment = (year, month) => {
  return fetch(`http://27.254.189.185:90/api/cotruck/shipment/${year}/${month}`)
    .then(response => response.json())
}

const getStatus = (year, month) => {
  return fetch(`http://27.254.189.185:90/api/cotruck/status/${year}/${month}`)
    .then(response => response.json())
}

const getAllData = (year, month) => {
  return Promise.all([getMaster(), getShipment(year, month), getStatus(year, month)])
}
// -----

const fetchAPI = () => {
  let titleText = document.querySelector('#title').textContent;
  let title = document.querySelector('#title');
  title.textContent = 'Loading Data...'
  fetch('http://27.254.189.185:90/api/cotruck/shipment')
    .then(res => res.json())
    .then(data => {
      shipment = data;
      fetch('http://27.254.189.185:90/api/cotruck/lp_number')
        .then(res => res.json())
        .then(data => {
          master = data;
          fetch('http://27.254.189.185:90/api/cotruck/status')
            .then(res => res.json())
            .then(data => {
              status = data;
              setReportCoTruck(master, shipment, status);
              title.textContent = titleText;
            })
        })
    });
}

const setReportCoTruck = (master, shipment, status) => {
  let dataList = [];
  let testList = [];

  let myDate = [];
  let minusDate = 0;
  let testMinusDate = 1;
  const date = new Date();  
  date.setDate(date.getDate()-1);
  let dd = date.getDate();

  for (let i = dd; i > 0; i--) {
    myDate[minusDate] = createDate(testMinusDate);
    minusDate++;
    testMinusDate++;
    if (minusDate === 7) {
      break;
    }
  }

  master.forEach(element => {
    let dateList = [];
    let dataObj = {};
    dataObj['lpNumber'] = element.s_LP_NUMBER;
    dataObj['type'] = element.s_WHEEL;
    dataObj['site'] = element.s_SITE_PRE;
    dataObj['kpi'] = element.i_KPI;

    myDate.forEach(date => {
      let dateObj = {};
      let count = 0;
      shipment.forEach(element => {
        if (date === parseDotNetDate(element.d_DELIVERY) && dataObj['lpNumber'] === element.coTruck[0].s_LP_NUMBER) {
          count += (1 / element.coTruck[0].truck_Numbers.i_KPI);
        }
      })
      dateObj['date'] = date;
      if (count === 0) {
        // use general 'forloop' for break a loop
        if(status.size === 0){
          dateObj['count'] = '-';
        }
        for (let element of status) {
          if (dataObj['lpNumber'] === element.s_LP_NUMBER && dateObj['date'] === parseDotNetDate(element.d_DELIVERY)) {
            dateObj['count'] = element.s_STATUS;
            break;
          } else {
            dateObj['count'] = '-';
          }
        }
      } else {
        dateObj['count'] = count;
      }
      dateList.push(dateObj);
    })
    dataObj['weekDate'] = dateList;
    dataList.push(dataObj);
  });

  createTable(dataList);
}

const createTable = (dataList) => {
  let myDate = [];
  let minusDate = 0;
  let testMinusDate = 1;
  const date = new Date();
  date.setDate(date.getDate()-1);
  let dd = date.getDate();

  for (let i = dd; i > 0; i--) {
    myDate[minusDate] = createDate(testMinusDate);
    minusDate++;
    testMinusDate++;
    if (minusDate === 7) {
      break;
    }
  }

  let myTable = "<div class='container-fluid'><table id='report-table' class='table table-striped text-center'><thead><tr><th>Site</th>";
  myTable += "<th>LP Number</th>";
  myTable += "<th>Truck Type</th>"
  myTable += "<th>KPI</th>";
  // create a date for table head
  for (let i = 0; i < myDate.length; i++) {
    myTable += `<th>${myDate[i]}</th>`;
  }
  myTable += "</tr></thead>";

  for (let ele of dataList) {
    myTable += `<tr><td>${ele.site}</td>`;
    myTable += `<td>${ele.lpNumber}</td>`;
    myTable += `<td>${ele.type}</td>`;
    myTable += `<td>${ele.kpi}</td>`;
    for (let dateEle of ele.weekDate) {
      myTable += `<td>${dateEle.count}</td>`;
    }
    myTable += `</tr>`
  }

  myTable += "</table></div>";

  document.getElementById('myTable').innerHTML = myTable;
}

const searchSite = () => {
  var input, filter, table, tr, td, i;
  let index;
  const content = document.querySelector('#filter').value;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  if (content === 'site') {
    index = 0
  } else if (content === 'number') {
    index = 1
  } else if (content === 'type') {
    index = 2;
  }

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[index];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

const createDate = (minusDate, month=0, selectYear=0) => {
  let date = new Date();
  if(month === 0 && selectYear === 0){
    month = date.getMonth() + 1;
    selectYear = date.getFullYear();
  }
  // let dd = today.getDate();
  // let mm = today.getMonth() + 1;
  // let yyyy = today.getFullYear();

  // let date = new Date();
  let dd;
  let mm;
  let yyyy;
  if (month < date.getMonth() + 1 || selectYear < date.getFullYear()) {
      date = new Date(selectYear, month, 0);
      date.setDate(date.getDate()-minusDate);
      dd = date.getDate();
      mm = date.getMonth() + 1;
      yyyy = date.getFullYear();
  } else {
      date.setDate(date.getDate()-minusDate);
      dd = (date.getDate()) === 0 ? 1 : date.getDate();
      mm = date.getMonth() + 1;
      yyyy = date.getFullYear();
  }

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  const concatDate = dd + '/' + mm + '/' + yyyy;
  return concatDate;
}

const parseDotNetDate = (str) => {
  let date = new Date(Date.parse(str));
  let dd = date.getDate();
  let mm = date.getMonth() +1;
  let yyyy = date.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  const concatDate = dd + '/' + mm + '/' + yyyy;

  return concatDate;
}

const checkFilter = () => {
  const filter = document.querySelector('#filter').value;
  const myInput = document.querySelector('#myInput');
  filter != 'none' ? myInput.removeAttribute('disabled') : myInput.setAttribute('disabled', true);
}

const clearInput = () => {
  const myInput = document.querySelector('#myInput');
  myInput.value = '';
  searchSite();
}

const setExcelCotruck = (master, shipment, status, month, selectYear) => {
  let dataList = [];
  let testList = [];

  let myDate = [];
  let minusDate = 0;
  let testMinusDate = 0;

  let date = new Date();
  let dd;
  if (month < date.getMonth() + 1 || selectYear < date.getFullYear()) {
      date = new Date(selectYear, month, 0);
      dd = date.getDate();
  } else {
      testMinusDate=1
      dd = (date.getDate() - 1) === 0 ? 1 : date.getDate() - 1;
  }

  // const date = new Date();  
  // date.setDate(date.getDate()-testMinusDate);
  // let dd = date.getDate();

  for (let i = dd; i > 0; i--) {
    myDate[minusDate] = createDate(testMinusDate, month, selectYear);
    minusDate++;
    testMinusDate++;
    if (minusDate === 32) {
      break;
    }
  }



  master.forEach(element => {
    let dateList = [];
    let dataObj = {};
    dataObj['lpNumber'] = element.s_LP_NUMBER;
    dataObj['type'] = element.s_WHEEL;
    dataObj['site'] = element.s_SITE_PRE;
    dataObj['kpi'] = element.i_KPI;

    myDate.forEach(date => {
      let dateObj = {};
      let count = 0;
      shipment.forEach(element => {
        if (date === parseDotNetDate(element.d_DELIVERY) && dataObj['lpNumber'] === element.coTruck[0].s_LP_NUMBER) {
          count += (1 / element.coTruck[0].truck_Numbers.i_KPI);
        }
      })
      dateObj['date'] = date;
      if (count === 0) {
        // use general 'forloop' for break a loop
        if(status.length === 0){
          dateObj['count'] = '-';
        }
        for (let element of status) {
          if (dataObj['lpNumber'] === element.s_LP_NUMBER && dateObj['date'] === parseDotNetDate(element.d_DELIVERY)) {
            dateObj['count'] = element.s_STATUS;
            break;
          } else {
            dateObj['count'] = '-';
          }
        }
      } else {
        dateObj['count'] = count;
      }
      dateList.push(dateObj);
    })
    dataObj['weekDate'] = dateList;
    dataList.push(dataObj);
  });

  return dataList;
}

const createExcelTable = (master, shipment, status, month, selectYear) => {
  const dataList = setExcelCotruck(master, shipment, status, month, selectYear);

  let myDate = [];
  let minusDate = 0;
  let testMinusDate = 0;

  let date = new Date();
  let dd;
  if (month < date.getMonth() + 1 || selectYear < date.getFullYear()) {
    date = new Date(selectYear, month, 0);
    dd = date.getDate();
 } else {
    testMinusDate=1
    dd = (date.getDate() - 1) === 0 ? 1 : date.getDate() -1;
 }
 
  // const date = new Date();
  // date.setDate(date.getDate()-testMinusDate);
  // let dd = date.getDate();

  for (let i = dd; i > 0; i--) {
    myDate[minusDate] = createDate(testMinusDate, month, selectYear);
    minusDate++;
    testMinusDate++;
    if (minusDate === 32) {
      break;
    }
  }

  let myTable = "<table border='2px' id='report-table' class='table table-striped text-center'><thead><tr><th>Site</th>";
  myTable += "<th>LP Number</th>";
  myTable += "<th>Truck Type</th>"
  myTable += "<th>KPI</th>";
  // create a date for table head
  for (let i = 0; i < myDate.length; i++) {
    myTable += `<th>${myDate[i]}</th>`;
  }
  myTable += "</tr></thead>";

  for (let ele of dataList) {
    myTable += `<tr><td>${ele.site}</td>`;
    myTable += `<td>${ele.lpNumber}</td>`;
    myTable += `<td>${ele.type}</td>`;
    myTable += `<td>${ele.kpi}</td>`;
    for (let dateEle of ele.weekDate) {
      myTable += `<td>${dateEle.count}</td>`;
    }
    myTable += `</tr>`
  }

  myTable += "</table>";

  return myTable;
}

//Export To Excel Functions
// -----
const exportToExcel = () => {
  const month = document.querySelector('#month').value;
  const selectYear = document.querySelector('#year').value;

  if(!month || !selectYear) {
    Swal.fire({
      type: 'warning',
      title: !month && !selectYear ? 'โปรดเลือกปีและเดือน' : !month ? 'โปรดเลือกเดือน' : 'โปรดเลือกปี',
      text: '',
    }) 
  }else {
     getAllData(selectYear, month)
      .then(([master, shipment, status]) => {
          setExcelDate(month, selectYear);
          
          let tab_text = createExcelTable(master, shipment, status, month, selectYear);

          tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");
          tab_text= tab_text.replace(/<img[^>]*>/gi,"");
          tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, "");

          let ua = window.navigator.userAgent;
          let msie = ua.indexOf("MSIE ");  

          if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
          {
              txtArea1.document.open("txt/html","replace");
              txtArea1.document.write(tab_text);
              txtArea1.document.close();
              txtArea1.focus(); 
              sa=txtArea1.document.execCommand("SaveAs",true,`${excelName}.xls`);
          }  
          else{             
            //   sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  
              sa = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);  
              saveAs(sa, `${excelName}.xls`)
          }
          return (sa);
      })
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

// Date Function
// -----
  const setSelectYear = () => {
    const startYear = 2018;
    const date = new Date();
    const year = date.getFullYear();
    let selectYear = '';

    selectYear += "<option selected value='' disabled>Select Year</option>";

    for (let i = startYear; i <= year; i++) {
      // selected when option value equal this year
      // selectYear += `<option value=${i} ${i === year ? 'selected' : null}>${i}</option>`;
      selectYear += `<option value=${i}>${i}</option>`;
    }

    document.querySelector('#year').innerHTML += selectYear;

    // setSelectMonth(year);
  }

  const setSelectMonth = (year) => {
    const filterDate = new Date();
    const filterYear = filterDate.getFullYear();
    let filterMonth = (year == filterYear ? (filterDate.getDate() !== 1 ? filterDate.getMonth() + 1 : filterDate.getMonth()) : 12);

    let selectMonth = "<option selected value='' disabled>Select Month</option>";

    for (let i = 1; i <= filterMonth; i++) {
      selectMonth += `<option value=${i}>${i < 10 ? '0' + i : i} ${monthNames[i - 1]}</option>`;
    }

    document.querySelector('#month').innerHTML = selectMonth;
  }

  const setExcelDate = (month, selectYear) => {

    let date = new Date();
    let year = selectYear;
    const dateFrom = '1';
    let dateTo = '';
 
    if (month < date.getMonth() + 1 || selectYear < date.getFullYear()) {
       date = new Date(year, month, 0);
       dateTo = date.getDate();
       year = date.getFullYear();
    } else {
       dateTo = (date.getDate() - 1) === 0 ? 1 : date.getDate() -1;
    }
    
    excelName = `D${year}${(monthNames[month-1]).substring(0, 3)}${dateFrom}To${dateTo}`;
 }
// -----
setSelectYear();
fetchAPI();