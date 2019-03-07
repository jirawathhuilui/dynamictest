let dataTableResultArr = [];
let headerArr = [];
let headerObj = {
    transectioN_CODE: 0,
    tranchecK_CODE: 0,
    s_TOD_NAME: '',
    s_SITE: '',
    s_WH: '',
    d_DATE_CREATE: '',
    s_SERVICE_TYPE: '',
    s_TRUCK_TYPE: '',
    s_LP_NUMBER: '',
    s_NAME_DRIVER: '',
    s_NAME_CHECKER: '',
    c_STATUS: '',
    f_LATITUDE: 0,
    f_LONGTITUDE: 0
}
let detailArr = [];
let questionDetail = {};
let countQuestion = 0;

const onBack = () => {
    $("#content").load("audit-register.html", () => {
        setCurrentDate();
        onStartPage();
        $('#pref-name').val(headerObj.s_NAME_CHECKER);
    });
    document.querySelector('#searchResult').style.visibility = 'visible';
    // location.reload();
}

const onNext = (tranCode) => {
    console.log("tranCode value" , tranCode.value)
    // console.log("tranCode text" , tranCode.text)
    // if(!onCheckTemp()){
    //     Swal.fire({
    //         type: 'warning',
    //         title: 'กรุณาใส่ข้อมูลให้ครบถ้วน',
    //         text: '',
    //       })
    // } else {
        onSubmitForm(tranCode);
        // onClickDetail(tranCode);
        document.querySelector('#searchResult').style.visibility = 'collapse'     

    // }
}


const onSearch = () => {
   
    let lpNumberValue = document.querySelector('#lp-number').value;
    let todValue = document.querySelector('#select-tod').value;
    let date = document.querySelector('#datepicker').value;
        let initial = date.split(/\//);
        date = [ initial[1], initial[0], initial[2] ].join('-');

        // console.log(todValue)
        // console.log(date)
        
 
    if(!onCheck()){
       Swal.fire({
          type: 'warning',
          title: 'กรุณาใส่ข้อมูลให้ครบถ้วน',
          text: '',
       })
 
    }else if((date != '' || date != null || date != 0) && todValue != "0" && lpNumberValue != "0") {
        fetch(`http://27.254.189.185:90/api/get/altp/status/all/${date}/${todValue}/${lpNumberValue}`)
             .then(response => response.json())
             .then(data => {
                data.length ? onSearchResult(data) : alertNoData()
             })
    
    }else if((date != '' || date != null || date != 0) && todValue != "0" ){
        fetch("http://27.254.189.185:90/api/get/dltp/header/alltoddate/"+ todValue + "/" + date)
             .then(response => response.json())
             .then(data => {
                data.length ? onSearchResult(data) : alertNoData()
             })
    }else{
       fetch("http://27.254.189.185:90/api/get/dltp/header/alldate/"+ date)
             .then(response => response.json())
             .then(data => {
                data.length ? onSearchResult(data) : alertNoData()
             })
    }
}

const alertNoData = () => {
    Swal.fire({
        type: 'warning',
        title: 'วันที่ท่านเลือกไม่มีข้อมูลในระบบ',
        text: '',
        }).then(document.getElementById('searchResult').innerHTML = '')
}

const onCheck = () => {
    return  !document.querySelector('#datepicker').value ? 0
            : !document.querySelector('#select-tod').value ? 0 
            : true;
}

const onSearchResult = (data) => {
    let searchResult = "<form action='audit-question.html'><div class='container-fluid'>";

        searchResult += "<table class='table table-striped text-center table-bordered table-hover table-sm'>";
        searchResult += "<thead>";

        searchResult += "<tr>";
        searchResult += "<a class='btn-lg btn-block color-yellow'>";
        searchResult += `<center><b>รายละเอียดแบบฟอร์มตรวจสอบ "แอลกอฮอล์, ออกซิเจน และอุณหภูมิก่อนโหลดสินค้า" ประจำวันที่: <u>${changeFormatDate(data[0].d_DATE_CREATE)}</u>`;
        searchResult += `</b></center>`;
        searchResult += "</a>";
        searchResult += "</tr>"

        searchResult += "<tr class='table-secondary'>";
        // searchResult += "<th style='vertical-align: middle;'>วันที่</th>";
        searchResult += "<th style='vertical-align: middle;'>ฝ่าย</th>";
        searchResult += "<th style='vertical-align: middle;'>แผนก</th>";
        searchResult += "<th style='vertical-align: middle;'>จังหวัด / พื้นที่</th>";
        searchResult += "<th style='vertical-align: middle;'>ประเภทรถ</th>";
        searchResult += "<th style='vertical-align: middle;'>ทะเบียนรถ</th>";
        searchResult += "<th style='vertical-align: middle;'>ชื่อ-สกุล<br>พขร</th>";
        searchResult += "<th style='vertical-align: middle;'>ตรวจสอบ<br>แบบฟอร์ม</th>";
        searchResult += "<th style='vertical-align: middle;'>ชื่อ-สกุล<br>ผู้ตรวจ 1</th>";
        searchResult += "<th style='vertical-align: middle;'>ชื่อ-สกุล<br>ผู้ตรวจ 2</th>";
        searchResult += "</tr>";

        searchResult += "</thead>";

    let auditDataArr = data.filter(resultObj => {
        return resultObj.c_STATUS === 'Audit'
    });
    let dataTableResultArr = data.filter(resultObj => {
        return resultObj.c_STATUS === 'N'
    });

    dataTableResultArr.forEach(dataTableEle => {
        dataTableEle.checkList = [];
        
        // console.log("dataTableEle" , dataTableEle) 
        let num  = 0;
        let checkArr = (
            auditDataArr.filter(dataEle => {
            return dataEle.tranchecK_CODE === dataTableEle.transectioN_CODE &&
                dataEle.s_TOD_NAME === dataTableEle.s_TOD_NAME &&
                dataEle.s_SITE === dataTableEle.s_SITE &&
                dataEle.s_WH === dataTableEle.s_WH &&
                dataEle.d_DATE_CREATE === dataTableEle.d_DATE_CREATE &&
                dataEle.s_TRUCK_TYPE === dataTableEle.s_TRUCK_TYPE &&
                dataEle.s_LP_NUMBER === dataTableEle.s_LP_NUMBER &&
                dataEle.s_NAME_DRIVER === dataTableEle.s_NAME_DRIVER
        })).sort((a, b) => a.transectioN_CODE - b.transectioN_CODE)

        console.log(checkArr)
        // console.log("-------------------------", checkArr)
        if(checkArr.length >= 2) {
            num = 2;
        }else if (checkArr.length > 0){
            num = 1;
        }

        for(let i = 0; i < num; i++ ) {
        // console.log(checkArr[i].s_NAME_CHECKER, checkArr[i].transectioN_CODE)
        dataTableEle.checkList.push(checkArr[i].s_NAME_CHECKER)
        }
    })

    // console.log('asdsad', dataTableResultArr)

    for (i = 0; i < dataTableResultArr.length; i++) {
        // console.log("dataTableResultArr", dataTableResultArr)     

        let d_DATE_CREATE = data[i].d_DATE_CREATE;
        const d_DATE = changeFormatDate(d_DATE_CREATE);

        let TruckType =  "" ;
            TruckType = dataTableResultArr[i].s_TRUCK_TYPE ?  dataTableResultArr[i].s_TRUCK_TYPE :  "ประเภทValue Error";

        let splitTruckType = TruckType.split(/ประเภท/).join('');


        searchResult += "<tr>";
        // searchResult += `<td style='vertical-align: middle;' id="vi${data[i].transectioN_CODE}_Date" value="${data[i].d_DATE_CREATE}">${d_DATE}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].s_TOD_NAME}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].s_SITE}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].s_WH}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${splitTruckType}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].s_LP_NUMBER}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].s_NAME_DRIVER}</td>`;
        
        if(dataTableResultArr[i].checkList.length < 2){

            searchResult += `<td style='vertical-align: middle;'>`;
            searchResult += `<button type="button" class="btn btn-block text-black color-yellow" id="submitTemp_${dataTableResultArr[i].transectioN_CODE}" value=${dataTableResultArr[i].transectioN_CODE} onclick="onNext(this)">รายละเอียด</button>`;
            // searchResult += `<a class="btn btn-block text-black color-yellow" id="submitTemp_${dataTableResultArr[i].transectioN_CODE}" value=${dataTableResultArr[i].transectioN_CODE} onclick="onNext(this)">${dataTableResultArr[i].transectioN_CODE}</a>`
            searchResult += `</td>`;

        }else{

            searchResult += `<td style='vertical-align: middle;'>`;
            searchResult += `<button type="button" class="btn btn-block text-white bg-success isDisabled" id="submitTemp_${dataTableResultArr[i].transectioN_CODE}" value=${dataTableResultArr[i].transectioN_CODE}>เสร็จสิ้น</button>`;
            // searchResult += `<a class="btn btn-block text-white color-green isDisabled" id="submitTemp_${dataTableResultArr[i].transectioN_CODE}" value=${dataTableResultArr[i].transectioN_CODE}>${dataTableResultArr[i].transectioN_CODE}</a>`
            searchResult += `</td>`;

        }        
        
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].checkList[0] != null ? dataTableResultArr[i].checkList[0] : ''}</td>`;
        searchResult += `<td style='vertical-align: middle;'>${dataTableResultArr[i].checkList[1] != null ? dataTableResultArr[i].checkList[1] : ''}</td>`;
        searchResult += "</tr>";
        
    }
    searchResult += "</table></div></form>";

    document.getElementById('searchResult').innerHTML = searchResult;

}

const changeFormatDate = (d_DATE_CREATE) => {
    var date = new Date(d_DATE_CREATE);
        var dd = date.getDate();
        
        var mm = date.getMonth()+1; 
        var yyyy = date.getFullYear();
        
            (dd < 10) ? dd = '0' + dd : dd;
            (mm < 10) ? mm = '0' + mm : mm;

        var d_DATE = dd + '/' + mm + '/' + yyyy;

        return d_DATE;
}

const onChangePage = (tranCode) => {
    
    // console.log(tranCode)

    fetch(`http://27.254.189.185:90/api/get/dltp/header/${tranCode.value}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            headerObj.s_TOD_NAME = data[0].sTodName;
            headerObj.tranchecK_CODE = data[0].sTransectionCode;
            headerObj.s_NAME_DRIVER = data[0].s_NAME_DRIVER;
            headerObj.s_SITE = data[0].sArea;
            headerObj.s_WH = data[0].sSize;

            let date = document.querySelector('#datepicker').value;
            let initial = date.split(/\//);
            date = [ initial[1], initial[0], initial[2] ].join('-');

            headerObj.d_DATE_CREATE = date;
            headerObj.s_TRUCK_TYPE = data[0].sTruckType;
            headerObj.s_NAME_DRIVER = data[0].sNameDriver;
            headerObj.s_NAME_CHECKER = document.querySelector('#pref-name').value;
            headerObj.s_LP_NUMBER = data[0].sLpNumber;

            questionDetail = data[0];
            $("#content").load("audit-question.html");
            onChooseTruckType(data[0].sTruckType);
        })
}

const onSubmitForm = (tranCode) => {
        headerObj.d_DATE_CREATE = document.querySelector('#datepicker').value;
        headerObj.s_TOD_NAME = document.querySelector('#select-tod').value;
        // headerObj.s_NAME_DRIVER = document.querySelector('#driver-name').value;
        headerObj.s_NAME_CHECKER = document.querySelector('#pref-name').value;
        headerObj.s_LP_NUMBER = document.querySelector('#lp-number').value;
        onChangePage(tranCode);
}

const postHeader = () => {
    fetch('http://27.254.189.185:90/api/addHeader/altp', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(headerObj)
    }).then(response => response.json())
}

const postDetail = () => {
    fetch('http://27.254.189.185:90/api/adddetail/altp', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(detailArr)
    }).then(response => response.json())
}

const postHeaderAndDetail = () => {
    return Promise.all([postHeader(), postDetail()]);
}

const onCheckTemp = () => {
        return !document.querySelector('#datepicker').value ? 0
        : !document.querySelector('#pref-name').value ? 0
        // : !document.querySelector('#lp-number').value ? 0
        // : !document.querySelector('#driver-name').value ? 0
        : true;
}

const onChooseTruckType = (selectType) => {
    
    var sName = selectType;
    
    fetch("http://27.254.189.185:90/api/cate/bk/แบบฟอร์มตรวจแอลกอฮอล์คนขับรถและอุณหภูมิรถ")
        .then(response => response.json())
        .then(data => {
            onSetQuestionDetail(data)
        })
        
        const onSetQuestionDetail = (data) => {

            let digitalForm = "<div class='card text-center'>";
            bg = "background-color:#999999";

            var i;
            countQuestion = 0;
            for (i = 0; i < data.length; i++) {                
                let check1 = '',
                    check2 = ''

                digitalForm += `<div class="card-header text-white" style="font-size:20px; ${bg}"><b>คำถาม ${data[i].i_quest_id} :</b> ${data[i].model_cate_type.s_cate_name}</div>`;
                digitalForm += `<div class="card-body">`;
                digitalForm += `<h5 class="card-title">${data[i].s_qus_name}</h5>`;

                countQuestion = countQuestion + 1;

                detailArr.push({
                    i_ID: 0,
                    i_CATE_ID: data[i].i_cate_id,
                    i_QUEST_ID: data[i].i_quest_id,
                    i_DET_ID: 0,
                    z: '',
                    s_REASON: ''
                })
                
                questionDetail.modelValues[i].iDetId === 1 ? check1 = 'checked' : check2 = 'checked'

                var j;
                for (j = 0; j < data[i].model_sm_header.model_sm_details.length; j++) {
                    
                    
                    let idbutton = data[i].i_quest_id;
                    let idetid = data[i].model_sm_header.model_sm_details[j].i_det_id;
                    let namebutton = data[i].model_sm_header.model_sm_details[j].s_det_name;
                    let valuebutton = data[i].model_sm_header.model_sm_details[j].s_value;

                    if (data[i].model_sm_header.s_name_head === "RadioButton") {

                        if(idetid == '1'){
                        
                            digitalForm += `<label class="btn text-white" style="margin-right:80px; background-color:#29883f;">
                                            <input type="radio" name=Q${idbutton} id=Q${idbutton} value=${valuebutton} det_id=${idetid} onclick="resetReason(this.id)" ${check1}> ${namebutton}
                                            </label >`;
                        }else if(idetid == 2){

                            digitalForm += `<label class="btn text-white" style="background-color:#e81d45;">
                                            <input type="radio" name=Q${idbutton} id=Q${idbutton} value=${valuebutton} det_id=${idetid} onclick="askReason(this.id)" ${check2}> ${namebutton}
                                            </label><p class="pl-2 text-danger" id="R${idbutton}"></p>`;
                        }
                        

                    }else if(idetid == '8') {

                        // if(i+1 == data.length) {
                        //     let tempArr = [3, 2, 1, 0, -1, -2, -3 ,-4, -5, -6, -7, -8, -9, -10]
                        //     digitalForm += `<select class="form-control" det_id=${idetid} type="number" name=Q${idbutton} id=Q${idbutton}`;
                        //         for(let z = -1; z < tempArr.length; z++) {
                        //             digitalForm += `<option value="${tempArr[z]}">${tempArr[z]} °C</option>`
                        //         }
                        //     digitalForm += `</select>`;
                            
                        // }else {

                            digitalForm += `<input step="any" det_id=${idetid} type="number" name=Q${idbutton} id=Q${idbutton} placeholder="ตัวเลขเท่านั้น" value="${questionDetail.modelValues[i].fValue}"
                                                pattern="[0-9]{3,}" min="-10" max="100" class="form-control" />`
                        // }
                    }

                }
                digitalForm += `</div>`;
                
            }
            digitalForm += "</div>";     

            document.getElementById('digitalForm').innerHTML = digitalForm;
    }
}

const postQuestion = () => {
    if(!checkAnswer()) {
        fetch('http://27.254.189.185:90/api/get/maxcodealtp')
        .then(response => response.json())
        .then(data => {
            // console.log('trannnnnnnnnnn' , data)
            headerObj.transectioN_CODE = data[0].iMaxTranCode + 1;
            headerObj.c_STATUS = 'Audit';
            detailArr.forEach(detail => {
                detail.i_ID = data[0].iMaxTranCode + 1;
            })
            postHeaderAndDetail()
            .then(([resHeader, resDetail]) => {
            Swal.fire({
                type: 'success',
                title: 'ส่งแบบฟอร์มเรียบร้อยแล้ว',
                text: '',
                timer: 3000
                }).then(result => {
                onBack();
                })
            })
        })
    }
}

const checkAnswer = () =>{
    let noAnswer = false;
    let checkFalse = false;
    let idtehod = "";
    let checkUserAnswer = 0;
    for(l = 0; l < countQuestion; l++){
        
        let countCheck = 0
        let t = "Q"+ (l+1);
        let answers  = document.getElementsByName(`${t}`)
        let x = document.querySelector(`#${t}`).value;
        for (var i = 0; i < answers.length ; i++)
        {
            if(answers.length === 1) {
                detailArr[l].s_VALUE = answers[i].value;
                detailArr[l].i_DET_ID = answers[i].getAttribute("det_id");
            }else {
                if (answers[i].checked)
                {    
                    detailArr[l].s_VALUE = answers[i].value;
                    detailArr[l].i_DET_ID = answers[i].getAttribute("det_id");
                    checkFalse = true;
                    idtehod = answers[1].id;
                
                    break;
                }else {
                    countCheck += 1;
                }
            }
            
        }


        countCheck === 2 ? noAnswer = true : null
        if( x === '' || x === undefined || x === null) {
        }else {
            checkUserAnswer++;
        }
    }

    checkUserAnswer < 1 ? noAnswer = true : null;

    noAnswer ? Swal.fire({
        type: 'warning',
        title: 'โปรดตอบคำถามให้ครบถ้วน',
        text: '',
        }) : null
    return noAnswer;
}

const scrollTo = (id) => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#${id}").offset().top
        }, 2000);
}

const askReason = (id) => {
    let eleId = id.replace("Q", "");
    eleId = Number(eleId) - 1;
    swalReason(eleId)
}

const swalReason = (eleId) => {
    Swal.fire({
        title: 'เหตุผลประกอบ',
        type: 'question',
        input: 'select',
        inputOptions: {
            'สภาพไม่พร้อมใช้': 'สภาพไม่พร้อมใช้',
            'หลักฐาน, อุปกรณ์ไม่ครบ': 'หลักฐาน, อุปกรณ์ไม่ครบ',
            'อื่นๆ': 'อื่นๆ'
        },
        inputPlaceholder: 'กรุณาเลือกเหตุผล',
        showCancelButton: false,
        }).then((result) => {
        if(result.dismiss === 'backdrop'){
            swalReason(eleId)
        }else if (result.dismiss === 'esc') {
            swalReason(eleId)
        }

        if (result.value === "") {
            swalReason(eleId)
        }else if(result.value === "อื่นๆ"){
            otherReason(eleId)
        }
        else {
            const reasonId = 'R' + (eleId + 1); 
            document.getElementById(reasonId).innerHTML = result.value;
            detailArr[eleId].s_REASON = result.value;
        }
        })
}

const otherReason = (eleId) => {
    swal.fire({
        title: 'กรุณากรอกเหตุผลของท่าน',
        type: 'question',
        input: 'text',
        showCancelButton: false,
    }).then((result) => {
        if(result.dismiss){
            otherReason(eleId)
        }

        if (result.value === "") {
            otherReason(eleId)
        }else {
            const reasonId = 'R' + (eleId + 1);
            document.getElementById(reasonId).innerHTML = result.value;
            detailArr[eleId].s_REASON = result.value;
        }
    })
}

const resetReason = (id) => {
    let eleId = id.replace("Q", "");
    eleId = Number(eleId) - 1;
    detailArr[eleId].s_REASON = "";

    const reasonId = 'R' + (eleId + 1); 
    document.getElementById(reasonId).innerHTML = "";
}

const askPrefName = () => {
    swal.fire({
        title: 'กรุณากรอกชื่อผู้ตรวจ',
        type: 'info',
        input: 'text',
        showCancelButton: false,
    }).then((result) => {
    
        // console.log(result.dismiss)
        if(result.dismiss){
        askPrefName()
        }else {
        
        if (result.value === "") {
        askPrefName()
        }else {
        headerObj.s_NAME_CHECKER = result.value;
        setAuditRegister();
        }
    }
    })
}

const setAuditRegister = () => {
    $(() => {
        $("#content").load("audit-register.html", () => {
        $('#pref-name').val(headerObj.s_NAME_CHECKER);
        $.getScript("js/audit-register-dltp.js"); 
        });
    });
}

const onClickDetail = () => {
    $(() => {
        $("#content").load("audit-question.html", () => {
        $('#pref-name').val(headerObj.s_NAME_CHECKER);
        $.getScript("js/audit-question.js"); 
        });
    });
}

askPrefName();