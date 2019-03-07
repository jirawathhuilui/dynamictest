const fetchAPI = () => {
  let titleText = document.querySelector('#title').textContent;
  let title = document.querySelector('#title');
  title.textContent = 'Loading Data...'
  let master = [];
  let shipment = [];
  let status = [];
  fetch('http://27.254.189.185:90/api/cotruck/shipment')
    .then(res => res.json())
    .then(data => {
      shipment = data;
      console.log(shipment);
      fetch('http://27.254.189.185:90/api/cotruck/lp_number')
        .then(res => res.json())
        .then(data => {
          master = data;
          console.log(master);
          fetch('http://27.254.189.185:90/api/cotruck/status')
            .then(res => res.json())
            .then(data => {
              status = data;
              console.log(status);
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
  // console.log('asd', date);
  date.setDate(date.getDate()-1);
  // console.log('test', date);
  let dd = date.getDate();
  console.log(dd);

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
            console.log(dateObj['date'], parseDotNetDate(element.d_DELIVERY))
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

  console.log(dataList);
  createTable(dataList);

}

const createTable = (dataList) => {
  let myDate = [];
  let minusDate = 0;
  let testMinusDate = 1;
  const date = new Date();
  // console.log('asd', date);
  // console.log('test', date);
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

  let myTable = "<div class='container-fluid'><table class='table table-striped text-center'><thead><tr><th>Site</th>";
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

const createDate = (minusDate) => {
  const today = new Date();
  today.setDate(today.getDate()-minusDate);
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

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
  let mm = date.getMonth() + 1;
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

fetchAPI();