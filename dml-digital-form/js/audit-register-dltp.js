let headerInfo = [];
let date = '';

   //----------------------------------------------------------------------------------------------------
   //-- Open -- Set Date on Start this page
   //----------------------------------------------------------------------------------------------------
   const setCurrentDate = () => {
      document.querySelector('#datepicker').value = getCurrentDate();
   }

   const getCurrentDate = () => {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
         
         (dd < 10) ? dd = '0' + dd : dd;
         (mm < 10) ? mm = '0' + mm : mm;
      
      return dd + '/' + mm + '/' + yyyy;
   }

   setCurrentDate();
   //----------------------------------------------------------------------------------------------------
   //-- Exit -- Set Date on Start this page
   //----------------------------------------------------------------------------------------------------
    


   //----------------------------------------------------------------------------------------------------
   //-- Open -- Set Dropdown TOD value
   //----------------------------------------------------------------------------------------------------
   const onStartPage = () => {
      date = document.getElementById('datepicker').value;
         var initial = date.split(/\//);
             date = [ initial[1], initial[0], initial[2] ].join('-');

      document.getElementById('lp-number').innerHTML = "";
      // document.querySelector('#driver-name').value = "";

      fetch(`http://27.254.189.185:90/api/get/altp/status/n/${date}`)
         .then(response => response.json())
         .then(data => setSelectTOD(data))
   }

      //-- Open -- Dropdown -- select-tod
      const setSelectTOD = (data) => {
      
         let selecttod = "";
            selecttod += "<option selected value='0' disabled>กรุณาเลือก...</option>";

         for (i = 0; i < data.length; i++) {
            selecttod += `<option value="${data[i].stod}">${data[i].stod}</option>`;
         }
         selecttod += "</select>";

         document.getElementById('select-tod').innerHTML = selecttod;

      }
      //-- Exit -- Dropdown -- select-tod

   onStartPage();
   //----------------------------------------------------------------------------------------------------
   //-- Exit -- Set Dropdown TOD value
   //----------------------------------------------------------------------------------------------------



   //----------------------------------------------------------------------------------------------------
   //-- Open -- Dropdown -- Lp number Value
   //----------------------------------------------------------------------------------------------------
   const onSelectTOD = (selectTODValue) => {
      
      fetch(`http://27.254.189.185:90/api/get/altp/status/n/${date}/${selectTODValue}`)
         .then(response => response.json())
         .then(data => {
            headerInfo = data;
            setLpNumber(data)
         })
   }

      // -- Open -- Dropdown -- lp-number
      const setLpNumber = (headerData) => {
         
         let lpnumber = "<option selected value='0' disabled>กรุณาเลือก...</option>";

         for (i = 0; i < headerData.length; i++) {
            lpnumber += `<option value="${headerData[i].sLpnumber}">${headerData[i].sLpnumber}</option>`;
         }
         
         document.getElementById('lp-number').innerHTML = lpnumber;

         setSelect2();
      }
      // -- Exit -- Dropdown -- lp-number

         // -- Open -- Search lp-number in Dropdown
         const setSelect2 = () => {
            $(document).ready(function () {
               $('#lp-number').select2({ width: 'resolve' });
            });
         }
         // -- Exit -- Search lp-number in Dropdown

   //----------------------------------------------------------------------------------------------------
   //-- Exit -- Dropdown -- Lp number Value
   //----------------------------------------------------------------------------------------------------



   //----------------------------------------------------------------------------------------------------
   //-- Open -- Show driver-name
   //----------------------------------------------------------------------------------------------------   
   // const onSelectLpNumber = (lpNumber) => {
      
   //    const filterLp = headerInfo.filter(data => {
   //       return data.sLpnumber == lpNumber
   //    })
     
   //    document.querySelector('#driver-name').value = filterLp[0].sNameDiver;
      
   // }
   //----------------------------------------------------------------------------------------------------
   //-- Exit -- Show driver-name
   //----------------------------------------------------------------------------------------------------






   
   

