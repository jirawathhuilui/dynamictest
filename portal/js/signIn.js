{/* <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> */}
{/* <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script> */}

const signin = () => { 
    var username = document.getElementById("btn_userID").value;
    var password = document.getElementById("btn_passPW").value;
    
    //method "GET" ส่งข้อมูลผ่าน URL "POST" ส่งผ่าน Body `
    fetch("http://27.254.189.185:90/api/user/"+username+"/"+password , { 
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
        if(!data[0]){
            console.log(username, password);
            console.log(data[0].s_USER_ID);
            console.log(data[0].s_USER_NAME);
            console.log(data[0].s_USER_GROUP);
            // window.location.href="http://localhost:8080/index.html";
            // window.location.replace('index.html');

        }else{
            console.log(username, password);
            console.log(data[0].s_USER_ID);
            console.log(data[0].s_USER_NAME);
            console.log(data[0].s_USER_GROUP);
            // window.location.href="http://localhost:8080/home.html";
            // window.location.replace('home.html');
            
            checklogin(data);

            // checklogout(data);
            
        }
    }); 
}

checklogin = (data) => {
    let Group = [data[0].s_USER_GROUP];
    let ID = [data[0].s_USER_ID];
    let Name = [data[0].s_USER_NAME];

    if(Group == '1')
    {
        ID;
        Name;
        section = "Admin";
        sessionStorage.setItem('group', Group)
        console.log(section);
        window.location.replace('home.html');
        window.alert("ยินดีต้อนรับ Admin");
    }
    else
    {
        window.location.replace('index.html');
        window.alert("โปรดตรวจสอบ Username และ Password ของท่าน");
    }
}

checklogout = () => {
    let group = sessionStorage.getItem('group');
    // alert(test);
    // let Group = [data[0].s_USER_GROUP];
    // let ID = [data[0].s_USER_ID];
    // let Name = [data[0].s_USER_NAME];

    if(group != '99')
    {
        // var Group = new Group;
        ID = null;
        Name = null;
        sessionStorage.setItem('group', 99);
        section = null;

        window.location.replace('index.html');
    } 
}

//     const signin = () => {
//     var username = document.getElementById('btn_userID').value;
//     var password = document.getElementById('btn_passPW').value;

//     // onSubmitSignIn(userID, passWD);
//     //New XMLHTTPRequest
//     var  request = new XMLHttpRequest();
//     request.open("GET", "http://27.254.189.185:90/api/user/{username}/{password}", false);
//     request.setRequestHeader("Authorization", authenticateUser(username, password));  
//     request.send();
//     // view request status
//     alert(request.status);
//     response.innerHTML = request.responseText;
// }

const check = () => {
    let group = sessionStorage.getItem('group')

    if(group === '99')
    {
        // var Group = new Group;
        ID = null;
        Name = null;
        sessionStorage.setItem('group', '99');
        section = null;

        window.location.replace('index.html');
    } 
}