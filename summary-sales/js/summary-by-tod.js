const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

let tableHeader = document.querySelector('thead');
let tableBody = document.querySelector('tbody');
let bodyHead = [];
// let TOD1 = [];
// let TOD2 = [];
// let TOD3 = [];
// let TOD4 = [];
// let TOD5 = [];
// let TOD6 = [];
// let WH = [];


//----------------------------------------------------------------------------------------------------
//-- Open -- Set Dropdown Year
//----------------------------------------------------------------------------------------------------
const onSelectYear = () => {

   let selectYear = document.querySelector('#selectYear').value;

   fetch(`http://27.254.189.185:5000/api/get/mis/${selectYear}`)
      .then(response => response.json())
      .then(data =>{
         createTableHead(data);
         createTableBody(data);

         // console.log(data)
   })

   // Set bodyHead
   fetch("http://27.254.189.185:5000/api/get/mis/tod")
      .then(response => response.json())
      .then(data => {
         bodyHead = [];
         for(i =0; i < data.length; i++){
            bodyHead.push(data[i].sTod);
            // console.log(data[i].sTod)
         }
      })
  
      const createTableHead = (data) => {

         let tHeader = "<thead>";
            tHeader += "<tr>";
            tHeader += "<th class='align-middle' rowspan='2'>";
            tHeader += "ปี"+"<br>"+`${selectYear}`;   
            tHeader += "</th>";

            for(i = 0; i < data.length; i++){
               // console.log(data[i].iMonth)

               tHeader += "<th colspan='2'>";
               tHeader += `${monthNames[data[i].iMonth - 1]}`
               tHeader += "</th>";

            }
            
            tHeader += "</tr>";
            tHeader += "<tr>";

            for(j = 0; j < data.length; j++){
               

               tHeader += "<th>";
               tHeader += "P";
               tHeader += "</th>";
               tHeader += "<th>";
               tHeader += "A";
               tHeader += "</th>";

            }

            tHeader += "</tr>";
            tHeader += "</thead>";

            tableHeader.innerHTML = tHeader;

      }
      


      const createTableBody = (data) => {
         let tbody = "<tbody>";
            // tbody += "<tr>";

      for(a =0; a < bodyHead.length; a++){
         // console.log(bodyHead[a])
         tbody += "<tr>";
         tbody += "<td style='font-weight:bold;'>";
         tbody += `${bodyHead[a]}`;
         tbody += "</td>";

         for(i = 0; i < data.length; i++){

            for(j = 0; j < data[i].detail.length; j++){

               // console.log(data[i].detail[j].sTodList)
               if(data[i].detail[j].sTodList === bodyHead[a]){
                  tbody += "<td style='font-weight:bold;'>";
                  tbody += `${numberformatter(data[i].detail[j].fPlan, 1)}`;
                  tbody += "</td>";

                  let st = Number(`${data[i].detail[j].fPlan}`) < Number(`${data[i].detail[j].fAct}`) 
                  // let st = `${data[i].detail[j].fPlan}` < `${data[i].detail[j].fAct}` 
                        ? '"background-color:#28a745; color:#ffffff; font-weight:bold;"'
                        : '"background-color:#dc3545; color:#ffffff; font-weight:bold;"';

                  tbody += `<td style=${st}>`;
                  tbody += `${numberformatter(data[i].detail[j].fAct, 1)}`;
                  tbody += "</td>";
                  
                  // console.log(data[i].detail[j].fPlan +"<"+ data[i].detail[j].fAct)

               }
               // else if(bodyHead[a] === data[i].detail[j].sTodList){
               //    tbody += "<td style='font-weight:bold;'>";
               //    tbody += "-";
               //    tbody += "</td>";
               //    tbody += `<td style='font-weight:bold;'>`;
               //    tbody += "-";
               //    tbody += "</td>";
               // }

            }

         }
         tbody += "</tr>";
         tbody += "</tbody>";

         tableBody.innerHTML = tbody;

      }
   }
      

}
onSelectYear();



const numberformatter = (num, toFix = 0) => {
      var n = num > 1000000 ? (num / 1000000 ).toFixed(toFix) + 'M'
            : num > 1000 ? (num / 1000 ).toFixed(toFix) + 'K'
            : num.toFixed(toFix) ;
      return n;

}
//----------------------------------------------------------------------------------------------------
//-- Exit -- Set Dropdown Year
//----------------------------------------------------------------------------------------------------