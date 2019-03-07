let provin = [];
let lpNub = [];
let selectArr = [];

const startPage = () => {
fetch('http://27.254.189.185:90/api/get/slpnum/filter/')
   .then(response => response.json())
   .then(lpNumberList => setSelectLPNumber(lpNumberList))
}

const getLPNumberInfo = (lpNumber) => {
   return fetch(`http://27.254.189.185:90/api/get/slpnum/filter/${lpNumber}`)
      .then(response => response.json())
}

const setSelectLPNumber = (lpNumberList) => {

   let selectLPNumber = "<option selected value='0' disabled>กรุณาเลือก...</option>";

   for (i = 0; i < lpNumberList.length; i++) {
      selectLPNumber += `<option value="${lpNumberList[i].sValue}">${lpNumberList[i].sValue}</option>`;
   }

   selectLPNumber += "</select>";
   document.getElementById('lp-number').innerHTML = selectLPNumber;
   setSelect2();
}

const onSelectLpNumber = (lpNumber) => {
   getLPNumberInfo(lpNumber).then(driverDetail => {
      if(driverDetail.length === 0) {
         Swal.fire({
            type: 'warning',
            title: 'ทะเบียนนี้ไม่มีข้อมูลในระบบ',
            text: '',
            }).then(result => {
               resetForm();
         })
      }else {
         selectArr = driverDetail;
         setSelectFilter(driverDetail);
         document.querySelector('#select-tod').value = driverDetail[0].sTOD;
         document.querySelector('#department').value = driverDetail[0].sWhpre;
         document.querySelector('#driver-name').value = driverDetail[0].sDriverName;
         document.querySelector('#select-truck-type').value = driverDetail[0].typeCars.sName;
         document.querySelector('#province').value = driverDetail[0].sprovin;
         serviceType = driverDetail[0].sServiceType
      }
   }) 
}

const resetForm = () => {
   document.querySelector('#select-tod').value = ''
   document.querySelector('#driver-name').value = ''
   document.querySelector('#select-truck-type').value = '' 
   document.querySelector('#province').value = ''
   document.getElementById('filter-driver').innerHTML = ''
   document.querySelector('#department').value = ''
}

const setSelectFilter = (driverDetail) => {
   let selectFilter = "";
   selectFilter += "<option selected value='' disabled>กรุณาเลือก...</option>";
         
   for (i = 0; i < driverDetail.length; i++) {
         if(driverDetail.length === 1){
            selectFilter += `<option value=${i} selected>${driverDetail[i].sServiceType} | ${driverDetail[i].sTruckType} | (${driverDetail[i].sprovin}) ${driverDetail[i].sDriverName}</option>`;
         }else {
            selectFilter += `<option value=${i} arr-position=${i} ${i===0 ? 'selected' : null}> ${driverDetail[i].sServiceType} |  ${driverDetail[i].sTruckType} | (${driverDetail[i].sprovin}) ${driverDetail[i].sDriverName}</option>`;
         }
   }

   selectFilter += "</select>";

   document.getElementById('filter-driver').innerHTML = selectFilter;
}  

const onSelectFilter = (arrPosition) => {
   document.querySelector('#select-tod').value = selectArr[arrPosition].sTOD;
   document.querySelector('#department').value = selectArr[arrPosition].sWhpre;
   document.querySelector('#driver-name').value = selectArr[arrPosition].sDriverName;
   document.querySelector('#select-truck-type').value = selectArr[arrPosition].typeCars.sName;
   document.querySelector('#province').value = selectArr[arrPosition].sprovin;
   serviceType = selectArr[arrPosition].sServiceType
}

const getCurrentDate = () => {
   var today = new Date();
   var dd = today.getDate();
      
      var mm = today.getMonth()+1; 
      var yyyy = today.getFullYear();
      if(dd < 10){
         dd = '0' + dd;
      } 
      
      if(mm < 10){
         mm = '0' + mm;
      } 
      return dd + '/' + mm + '/' + yyyy;
}
   
const setCurrentDate = () => {
   document.querySelector('#datepicker').value = getCurrentDate();
}
   
const setSelect2 = () => {
   $(document).ready(function () {
      $('#lp-number').select2({ width: 'resolve' });
   });
}

startPage();
setCurrentDate();