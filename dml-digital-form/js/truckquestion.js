let serviceType = '';
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
let countQuestion = 0;

const onBack = () => {
    $("#content").load("empregister.html",function() {
        startPage();
        setCurrentDate();
    });

}


const onNext = () => {
    detailArr = []

    if(!onCheckTemp()){
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
        $("#content").load("from-question.html");
        onChooseTruckType(selectType);
}

const onSubmitForm = () => {
        headerObj.s_TOD_NAME = document.querySelector('#select-tod').value;
        headerObj.s_SITE = document.querySelector('#department').value;
        headerObj.s_WH = document.querySelector('#province').value;
        let date = document.querySelector('#datepicker').value;
        let initial = date.split(/\//);
        date = [ initial[1], initial[0], initial[2] ].join('-');
        headerObj.d_DATE_CREATE = date;
        headerObj.s_TRUCK_TYPE = document.querySelector('#select-truck-type').value;
        headerObj.s_NAME_DRIVER = document.querySelector('#driver-name').value;
        headerObj.s_LP_NUMBER = document.querySelector('#lp-number').value;
        headerObj.s_SERVICE_TYPE = serviceType;
        onChangePage();
}

const postHeader = () => {
    fetch('http://27.254.189.185:90/api/post/addheader', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(headerObj)
    }).then(response => response.json())
}

const postDetail = () => {
    fetch('http://27.254.189.185:90/api/post/adddetail', {
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
    return !document.querySelector('#select-tod').value ? 0 
        : !document.querySelector('#department').value ? 0 
        : !document.querySelector('#province').value ? 0
        : document.querySelector('#select-truck-type').value === '0' ? 0
        : document.querySelector('#lp-number').value === '0' ? 0
        : !document.querySelector('#driver-name').value ? 0
        : !document.querySelector('#datepicker').value ? 0
        : true;
}

    const onChooseTruckType = (selectType) => {
        
        var sName = selectType;

        fetch("http://27.254.189.185:90/api/cate/bk/"+sName)
            .then(response => response.json())
            .then(data => {
                onSetQuestionDetail(data)
            })
            
            const onSetQuestionDetail = (data) => {

                let digitalForm = "<div class='card text-center'>";
                if(sName == 'ประเภทรถเย็น'){
                    bg = "background-color:#c1429a;";
                }else if(sName == 'ประเภทรถ 4 ล้อ'){
                    bg = "background-color:#42c19e;";
                }else if(sName == 'ประเภทรถ 6 ล้อขึ้นไป'){
                    bg = "background-color:#c1b142;";
                }else if(sName == 'ประเภทรถป้ายเหลือง 6 ล้อขึ้นไป'){
                    bg = "background-color:#4269c1;";
                }
                
                var i;
                countQuestion = 0;
                for (i = 0; i < data.length; i++) {                
                    
                    digitalForm += `<div class="card-header text-white" style="font-size:20px; ${bg}">${i+1 === data.length ?  '' : `<b>คำถาม ${data[i].i_quest_id} :</b>`} ${data[i].model_cate_type.s_cate_name}</div>`;
                    digitalForm += `<div class="card-body">`;
                    digitalForm += `<h5 class="card-title">${data[i].s_qus_name}</h5>`;

                    countQuestion = countQuestion + 1;

                    detailArr.push({
                        i_ID: 0,
                        i_CATE_ID: data[i].i_cate_id,
                        i_QUEST_ID: data[i].i_quest_id,
                        i_DET_ID: 0,
                        s_VALUE: '',
                        s_REASON: ''
                    })

                    var j;
                    for (j = 0; j < data[i].model_sm_header.model_sm_details.length; j++) {
                        

                        let idbutton = data[i].i_quest_id;
                        let idetid = data[i].model_sm_header.model_sm_details[j].i_det_id;
                        let namebutton = data[i].model_sm_header.model_sm_details[j].s_det_name;
                        let valuebutton = data[i].model_sm_header.model_sm_details[j].s_value;
                        

                        if (data[i].model_sm_header.s_name_head === "RadioButton") {

                            if(idetid == '1'){
                            
                                digitalForm += `<label class="btn text-white" style="margin-right:80px; background-color:#29883f;">
                                                <input type="radio" name=Q${idbutton} id=Q${idbutton} value=${valuebutton} det_id=${idetid} onclick="resetReason(this.id)"> ${namebutton}
                                                </label>`;
                            }else if(idetid == 2){
                                digitalForm += `<label class="btn text-white" style="background-color:#e81d45;">
                                                <input type="radio" name=Q${idbutton} id=Q${idbutton} value=${valuebutton} det_id=${idetid} 
                                                > ${namebutton}
                                                </label><p class="pl-2 text-danger" id="R${idbutton}"></p>`;
                            }
                            // ${i+1 === data.length ? 'onclick="askReason(this.id)"' : null}
                        } else if(idetid == '8') {

                            digitalForm += `<input det_id=${idetid} type="number" name=Q${idbutton} id=Q${idbutton} placeholder="ตัวเลขเท่านั้น" value=""
                                             pattern="[0-9]{3,}" min="0" max="100" class="form-control" />`
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
            fetch('http://27.254.189.185:90/api/tran/maxcode/r1')
            .then(response => response.json())
            .then(data => {
                headerObj.transectioN_CODE = data[0].maxTranCode + 1;
                headerObj.c_STATUS = 'N';
                detailArr.forEach(detail => {
                    detail.i_ID = data[0].maxTranCode + 1;
                })
                postHeaderAndDetail()
                .then(([resHeader, resDetail]) => {
                Swal.fire({
                    type: 'success',
                    title: 'ส่งแบบฟอร์มเรียบร้อยแล้ว',
                    text: '',
                  }) 
                onBack();
                })
            })
        }

    }

    const checkAnswer = () =>{
        let noAnswer = false;
        let checkFalse = false;
        let falseId = "";
        for(l = 0; l < countQuestion; l++) {
            
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
                        // const checkValue = answers[i].getAttribute("det_id");
                        // if(checkValue === '2' && !checkFalse) {
                        //     checkFalse = true; 
                        //     falseId = answers[i].id;
                        // }
                    
                        break;
                    }else {
                        countCheck += 1;
                    }
                }
            }

            countCheck === 2 ? noAnswer = true : null
            // if( x === '' || x === undefined || x === null) {
            //     noAnswer = true;
            // }
        }

        if(noAnswer) {
            Swal.fire({
                type: 'warning',
                title: 'โปรดตอบคำถามให้ครบถ้วน',
                text: '',
              })
        }else {
            // if(checkFalse) {
            //     scrollTo(falseId);
            //     noAnswer = true;
            // }
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