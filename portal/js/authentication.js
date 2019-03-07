const checklogin = () => {
    var username = document.getElementById("txt_userID").value;
    var password = document.getElementById("txt_passPW").value;

    if(username == "" && password == ""){
        window.alert("กรุณากรอก Username และ Password");
    }
    else if(username == ""){
        window.alert("กรุณากรอก Username");
    }
    else if(password == ""){
        window.alert("กรุณากรอก Password");
    }
    else{
        
        //method "GET" ส่งข้อมูลผ่าน URL "POST" ส่งผ่าน Body `
        fetch("http://27.254.189.185:90/api/user/getrequest/"+username+"/"+password , { 
            method: "GET", 
            headers: {'Content-Type': 'application/json'},
        //  body: JSON.stringify({ 
        //   "username": userID,
        //   "password": password
        //  }) 
        }) 
        .then(response => response.json()) 
        .then(data => { 
            //เงื่อนไข ตามด้วย ? ค่าจริง คั่นด้วย : ค่าเท็จ 
            // !data[0] ? console.log(username, password) : console.log(username, password);
            if(!data[0]) {
                console.log(username, password);
                window.alert("Username or Password ผิดพลาด");
                window.location.replace('index.html');
    
            }else {
                console.log(username, password);
                console.log(data[0].userName);
                console.log(data[0].password);
                console.log(data[0].userGrp);
    
                checkgroup(data);
                
            }
        }); 
    }
}


const checkgroup = (data) => {
    let Groupin = [data[0].userGrp];
    // let ID = [data[0].s_USER_ID];
    // let Name = [data[0].s_USER_NAME];

    if(Groupin == '1'){
        section = "Admin";
        sessionStorage.setItem('groupValue', Groupin);
        window.alert("ยินดีต้อนรับ Admin");
        window.location.replace('home.html');
    }
    else if(Groupin == '2'){
        section = "Admin";
        sessionStorage.setItem('groupValue', Groupin);
        window.alert("ยินดีต้อนรับ Admin");
        window.location.replace('home.html');
    }
    else{
        window.location.replace('index.html');
        window.alert("โปรดตรวจสอบ Username และ Password ของท่าน");
    }
}


const checklogout = () => {
    let Groupout = sessionStorage.getItem('groupValue');

    // if(Groupout != "null"){
    //     sessionStorage.setItem('groupValue', null);
    //     window.location.replace('index.html');
    // }

    Groupout != "null" ? sessionStorage.setItem('groupValue', null) + window.location.replace('index.html') + window.alert("LogOut Success") 
                         : null ;
}

const startpage = () => {
    let Groupout = sessionStorage.getItem('groupValue');

    Groupout == null || Groupout == "null" ? window.location.replace("index.html") :  window.location ;
}
