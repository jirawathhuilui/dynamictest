let dataArr = [];
let statusArr = [];
const url = `http://27.254.189.185:90/api/cotruck/lp_number`;
const urlStatus = `http://27.254.189.185:90/api/cotruck/status`;
fetch(url)
  .then(res => res.json())
  .then(data => {
    dataArr = data;
  });

const fetchStatus = () => {
  fetch(urlStatus)
    .then(res => res.json())
    .then(data => {
      statusArr = data;
      createTable(statusArr)
    });
}

const postAPI = () => {
  let url = 'http://27.254.189.185:90/api/cotruck/status';
  let completeUrl = 'complete_page.html'
  const delivery = document.querySelector("#datepicker");
  const number = document.querySelector("#locality-dropdown");
  const status = document.querySelector("#status");
  const site = document.querySelector('#site');
  let method = 'post';

  let data = {};
  let initial = delivery.value.split(/\//);
  let formatDate = [initial[1], initial[0], initial[2]].join('/');

  // console.log(site.value);
  if (formatDate === "" || (number.value === "เลือกทะเบียบรถ" || number.value === "") || status.value === "เลือกสถานะ") {
    swal('โปรดใส่ข้อมูลให้ครบถ้วน', '');
  } else {
    data[delivery.name] = formatDate;
    data[number.name] = number.value;
    data[status.name] = status.value;
    data[site.name] = site.value;

    // console.log(JSON.stringify(data));

    for (let ele of statusArr) {
      if (data[delivery.name] === parseDotNetMM(ele.d_DELIVERY) && data[number.name] === ele.s_LP_NUMBER && data[site.name] === ele.s_SITE) {
        method = 'put';
        fetchApi(method, data);
        break;
      }
    }

    if (method === 'post') {
      fetchApi(method, data);
    }
  }
}

const fetchApi = (method, data) => {
  fetch('http://27.254.189.185:90/api/cotruck/status', {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    method: method
  })
    .then(res => {
      if (method === 'post') {
        res.status === 200 ?
          complete() : swal('Error: Please try again.')
      } else if (method === 'put') {
        res.status === 204 ?
          complete() : swal('Error: Please try again.')
      }
    })
    .catch(err => console.log("Application Error"));;
}

const setLPNumber = (siteValue) => {
  let dropdown = $('#locality-dropdown');

  dropdown.empty();

  dropdown.append('<option selected="true" value="เลือกทะเบียบรถ" disabled>เลือกทะเบียนรถ</option>');
  dropdown.prop('selectedIndex', 0);

  dataArr.forEach(ele => {
    if (siteValue === ele.s_SITE_PRE) {
      dropdown.append($('<option></option>').attr('value', ele.s_LP_NUMBER).text(ele.s_LP_NUMBER));
    }
  })
}

const siteChange = () => {
  const siteValue = document.querySelector('#site').value;
  const lpNumberDrop = document.querySelector('#locality-dropdown');
  const alertSite = document.querySelector('#alertSite');
  if (siteValue === 'none') {
    lpNumberDrop.innerHTML = 'เลือกทะเบียนรถ';
    lpNumberDrop.value = 'เลือกทะเบียบรถ';
    lpNumberDrop.setAttribute('disabled', true);
    // alertSite.innerHTML = ' โปรดเลือก Site';
  } else if (siteValue) {
    setLPNumber(siteValue);
    lpNumberDrop.removeAttribute('disabled');
    alertSite.innerHTML = '';
  }
}

const createTable = (statusArr) => {
  let myTable = `<br><br>
  <div class='container'>
  <h3>Status ที่เพิ่มแล้ว</h3><table class='table table-stripe text-center'>`;
  myTable += `<thead><tr>`;
  myTable += `<th>Date</th>`;
  myTable += `<th>Site</th>`;
  myTable += `<th>LP Number</th>`;
  myTable += `<th>Status</th>`;
  myTable += `</tr></thead>`;

  for (let ele of statusArr) {
    myTable += `<tr><td>${parseDotNetDate(ele.d_DELIVERY)}</td>`;
    myTable += `<td>${ele.s_SITE}</td>`;
    myTable += `<td>${ele.s_LP_NUMBER}</td>`;
    myTable += `<td>${ele.s_STATUS}</td></tr>`
  }

  document.querySelector('#myTable').innerHTML = myTable;
  searchSet();
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

const search = () => {
  var inputDate, inputSite, filter, table, tr, tdDate, tdSite, i;
  inputDate = document.getElementById('datepicker');
  inputSite = document.getElementById('site');
  filterDate = inputDate.value.toUpperCase();
  filterSite = inputSite.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    tdDate = tr[i].getElementsByTagName("td")[0];
    tdSite = tr[i].getElementsByTagName("td")[1];
    if (tdDate && tdSite) {
      if (tdDate.innerHTML.toUpperCase().indexOf(filterDate) > -1 && tdSite.innerHTML.toUpperCase().indexOf(filterSite) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

const parseDotNetMM = (str) => {
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

  const concatDate = mm + '/' + dd + '/' + yyyy;
  return concatDate;
}

const disabledClick = () => {
  const lpNumber = document.querySelector('#locality-dropdown');

  if (lpNumber.disabled === true) {
    swal('กรุณาเลือก Site', '');
  }
}

const getCurrentDate = () => {
  const date = new Date();
  date.setDate(date.getDate()-1);
  return '0'+date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}

$(document).ready(function () {
  $('.js-example-basic-single').select2();
});

const setCurrentDate = () => {
  document.querySelector('#datepicker').value = getCurrentDate();
}

const searchSet = () => {
  search();
}

const complete = () => {
  fetchStatus();
  swal('เพิ่มข้อมูลเรียบร้อย', '', "success");
}

const refresh = () => {
  location.reload();
}

fetchStatus();
setCurrentDate();