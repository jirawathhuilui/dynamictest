let serviceType = '';
let headerArr = [];
// let headerObj = {
//     transectioN_CODE: 0,
//     tranchecK_CODE: 0,
//     s_TOD_NAME: '',
//     s_SITE: '',
//     s_WH: '',
//     d_DATE_CREATE: '',
//     s_SERVICE_TYPE: '',
//     s_TRUCK_TYPE: '',
//     s_LP_NUMBER: '',
//     s_NAME_DRIVER: '',
//     s_NAME_CHECKER: '',
//     c_STATUS: '',
//     f_LATITUDE: 0,
//     f_LONGTITUDE: 0,
//     i_TRIP: 0,
// }
let headerObj = {}

let detailArr = [];
let countQuestion = 0;

let cateAndDet = {
    cate: 0,
    det: 0
}

const onBack = () => {
    $("#content").load("temp-trip-register.html", function () {
        startPage();
        setCurrentDate();
    });
}


const onNext = () => {
    headerObj = {
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
        f_LONGTITUDE: 0,
        i_TRIP: 0,
    }
    detailArr = []
    // console.log(!onCheckTemp())
    if (!onCheckTemp()) {
        Swal.fire({
            type: 'warning',
            title: 'กรุณาใส่ข้อมูลให้ครบถ้วน',
            text: '',
        })
    } else {
        onSubmitForm();
    }
}

const onChangePage = () => {
    let selectType = document.querySelector('#select-truck-type').value;
    $("#content").load("temp-trip-question.html");
    fetch(`http://27.254.189.185:90/api/get/temp/header/filter/${headerObj.d_DATE_CREATE}/${headerObj.s_LP_NUMBER}/${headerObj.i_TRIP}`)
    .then(response => response.json())
    .then(dataInfo => {
        if(dataInfo.length != 0) {
            headerObj.transectioN_CODE = dataInfo[0].sTransectionCode;
        }
        console.log(dataInfo)
        if(dataInfo.c_STATUS === 'Success') {
            Swal.fire({
                type: 'success',
                title: 'ทะเบียนที่ปิดงานเรียบร้อยแล้ว',
                text: '',
            })
            onBack();
        }
        onChooseTruckType(dataInfo);
    })
}

const onSubmitForm = () => {
    headerObj.s_TOD_NAME = document.querySelector('#select-tod').value;
    headerObj.s_SITE = document.querySelector('#department').value;
    headerObj.s_WH = document.querySelector('#province').value;
    let date = document.querySelector('#datepicker').value;
    let initial = date.split(/\//);
    date = [initial[1], initial[0], initial[2]].join('-');
    headerObj.i_TRIP = document.querySelector('#trip').value;
    headerObj.d_DATE_CREATE = date;
    headerObj.s_TRUCK_TYPE = document.querySelector('#select-truck-type').value;
    headerObj.s_NAME_DRIVER = document.querySelector('#driver-name').value;
    headerObj.s_LP_NUMBER = document.querySelector('#lp-number').value;
    headerObj.s_SERVICE_TYPE = serviceType;
    onChangePage(); 
}

const postHeader = () => {
    return fetch('http://27.254.189.185:90/api/addHeader/altp', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(headerObj)
    }).then(response => response.json())
}

const postDetail = () => {
    return fetch('http://27.254.189.185:90/api/adddetail/altp', {
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
    return document.querySelector('#filter-driver').value === '' ? 0 
    : document.querySelector('#trip').value === '0' ? 0
        : !document.querySelector('#select-tod').value ? 0 
        : !document.querySelector('#department').value ? 0
            : !document.querySelector('#province').value ? 0
                : document.querySelector('#select-truck-type').value === '' ? 0
                    : document.querySelector('#lp-number').value === '0' ? 0
                        : !document.querySelector('#driver-name').value ? 0
                            : !document.querySelector('#datepicker').value ? 0
                                    : true;z
}

const onChooseTruckType = (dataInfo) => {
    // var sName = selectType;

    fetch("http://27.254.189.185:90/api/cate/bk/แบบฟอร์มตรวจอุณภูมิระหว่างขับรถ")
        .then(response => response.json())
        .then(data => {
            onSetQuestionDetail(data)
        })

    const onSetQuestionDetail = (data) => {
        console.log(data[0]);
        let digitalForm = "<div class='card text-left'>";
        bg = "background-color:#999999";

        var i;
        countQuestion = 0;

        cateAndDet.cate = data[0].i_cate_id;
        cateAndDet.det = data[0].model_sm_header.model_sm_details[0].i_det_id;

        let disabledEle = dataInfo.length ? (dataInfo[0].cStatus === 'Success' ? 'disabled' : null) : null;

        if(disabledEle){
            document.querySelector('#save-button').disabled = true
            document.querySelector('#close-button').disabled = true
        }
        console.log(disabledEle)
        digitalForm += `<div class="card-header text-white form-inline" style="font-size:20px; ${bg}">
                            <button class='btn btn-light' onclick='onAddInputTag()' ${disabledEle}>เพิ่ม</button> 
                            <button class='btn btn-danger ml-2' onclick='onRemoveInputTag()' ${disabledEle}>ลบ</button>
                            <p class='pl-2'>${data[0].s_qus_name} ${disabledEle ? '(ปิดงานแล้ว)' : ''}</p>
                        </div>`;

        digitalForm += `<div class="card-body" id="card-body">
                        </div>`

        digitalForm += "</div>";

        document.getElementById('digitalForm').innerHTML = digitalForm;

        if(dataInfo.length){
            for(let i = 0; i < dataInfo[0].modelValues.length; i++) {
                onAddInputTag(dataInfo[0].modelValues[i], disabledEle)
            }
        }
    }
}

const postQuestion = (closeWork='') => {
    if (!checkAnswer()) {
        if(headerObj.transectioN_CODE === 0) {
        fetch('http://27.254.189.185:90/api/get/maxcodealtp')
            .then(response => response.json())
            .then(data => {
                headerObj.transectioN_CODE = data[0].iMaxTranCode + 1;
                headerObj.c_STATUS = (closeWork === 'insertClosed' ? 'Success' : 'Process');
                detailArr.forEach(detail => {
                    detail.i_ID = data[0].iMaxTranCode + 1;
                })
                postHeaderAndDetail()
                    .then(([resHeader, resDetail]) => {
                        console.log('Post Question')
                        console.log(resHeader, resDetail)
                        if(closeWork) {
                            console.log('11')
                        }else {
                            Swal.fire({
                                type: 'success',
                                title: 'บันทึกแบบฟอร์มเรียบร้อยแล้ว',
                                text: '',
                            })
                            onBack();
                        }
                    })
            })
        }else {
            fetch(`http://27.254.189.185:90/api/delete/detail/${headerObj.transectioN_CODE}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(detailArr)
            }).then(response => {
                detailArr.forEach(detail => {
                    detail.i_ID = headerObj.transectioN_CODE;
                })
                postDetail().then(() => {
                    console.log('Update Question')
                    if(closeWork === 'putClosed') {
                        console.log('11')
                    }else {
                        Swal.fire({
                            type: 'success',
                            title: 'บันทึกแบบฟอร์มเรียบร้อยแล้ว',
                            text: '',
                        })
                        onBack();
                    }
                })
            })
        }
    }
}

const closeWork = () => {
    if(headerObj.transectioN_CODE !== 0) {
        postQuestion('putClosed')
        if (!checkAnswer()) {
            headerObj.c_STATUS = 'Success';
            // console.log('asdsad')
            fetch(`http://27.254.189.185:90/api/update/header/altp/${headerObj.transectioN_CODE}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(headerObj)
            }).then(response => {
                Swal.fire({
                    type: 'success',
                    title: 'ท่านปิดงานเรียบร้อยแล้ว',
                    text: '',
                })
                onBack();
                })
            }
        }else {
            postQuestion('insertClosed')
            Swal.fire({
                type: 'success',
                title: 'ท่านปิดงานเรียบร้อยแล้ว',
                text: '',
            })
            onBack();
        }
        // else {
        //     Swal.fire({
        //         type: 'warning',
        //         title: 'ทะเบียนนี้ยังไม่มีการบันทึกผลตรวจจึงไม่สามารถปิดงานได้',
        //         text: '',
        //     })
        // }
}

const onAddInputTag = (dataInfoElement=0, disabledEle) => {
    let newInputNo = parseInt($('#total-input').val()) + 1;

    detailArr.push({
        i_ID: 0,
        i_CATE_ID: cateAndDet.cate,
        i_QUEST_ID: newInputNo,
        i_DET_ID: cateAndDet.det,
        f_VALUE: 0,
        s_REASON: ''
    })

    let newInput = `<div id='tag-${newInputNo}'>
                        <label>จุดที่ ${newInputNo}:</label>
                        <input step="any" det_id=${newInputNo} type="number" name=Q${newInputNo} id=Q${newInputNo} placeholder="ตัวเลขเท่านั้น" value="${dataInfoElement ? dataInfoElement.fValue : ''}" pattern="[0-9]" class="form-control" ${disabledEle}/>
                        <br>    
                    </div>`

    $('#card-body').append(newInput)
    $('#total-input').val(newInputNo)
}

function onRemoveInputTag() {
    var lastInputNo = $('#total-input').val();
  
    if (lastInputNo > 1) {
      $('#tag-' + lastInputNo).remove();
      $('#total-input').val(lastInputNo - 1);

      detailArr.splice(-1, 1)
    }
}

const checkAnswer = () => {
    let sumInput =  parseInt($('#total-input').val())

    let noAnswer = false;
    let checkFalse = false;
    let falseId = "";
    let checkUserAnswer = 0;
    for (l = 0; l < sumInput; l++) {
        console.log(l)
        let countCheck = 0
        let t = "Q" + (l + 1);
        let answers = document.getElementsByName(`${t}`)
        let x = document.querySelector(`#${t}`).value;

        console.log(answers);
        for (var i = 0; i < answers.length; i++) {
            if (answers.length === 1) {
                detailArr[l].f_VALUE = answers[i].value;
            }
        }

        if (x === '' || x === undefined || x === null) {
            noAnswer = true;
        }
    }

    if (noAnswer) {
        Swal.fire({
            type: 'warning',
            title: 'โปรดตอบคำถามให้ครบถ้วน',
            text: '',
        })
    }

    return noAnswer;
}

const scrollTo = (id) => {
    Swal.fire({
        type: 'error',
        title: 'แบบสอบถามไม่ผ่านเกณฑ์ โปรดติดต่อเจ้าหน้าที่ประจำคลังสินค้า!'
    }).then(() => {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(`#${id}`).offset().top - 400
        }, 2000);
    })
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
        if (result.dismiss === 'backdrop') {
            swalReason(eleId)
        } else if (result.dismiss === 'esc') {
            swalReason(eleId)
        }

        if (result.value === "") {
            swalReason(eleId)
        } else if (result.value === "อื่นๆ") {
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
        if (result.dismiss) {
            otherReason(eleId)
        }

        if (result.value === "") {
            otherReason(eleId)
        } else {
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