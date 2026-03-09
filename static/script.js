let loginStage = 0;

function add(text,type){
    let box=document.getElementById("chat-box");
    let d=document.createElement("div");
    d.className="msg "+type;
    d.innerText=text;
    box.appendChild(d);
    box.scrollTop=box.scrollHeight;
}

function enterSend(e){ if(e.key==="Enter") send(); }
function clearChat(){ document.getElementById("chat-box").innerHTML=""; }
function typing(show){ document.getElementById("typing").style.display=show?"block":"none"; }

function openLogin(){ document.getElementById("loginPopup").style.display="flex"; }
function closeLogin(){ document.getElementById("loginPopup").style.display="none"; }

function submitLogin(){
    let email=document.getElementById("emailInput").value.trim();
    let error=document.getElementById("loginError");

    let pattern=/^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if(pattern.test(email)){
        document.getElementById("username").innerText=email;
        error.innerText="";
        closeLogin();
        add("✅ Logged in successfully!","bot");
        loginStage=2;
    }else{
        error.innerText="❌ Invalid email format";
    }
}

async function send(){
    let input=document.getElementById("input");
    let text=input.value.trim();
    if(!text) return;

    add(text,"user");
    input.value="";

    if(loginStage===0){
        add("🔐 Would you like to login? (yes/no)","bot");
        loginStage=1;
        return;
    }

    if(loginStage===1){
        if(text.toLowerCase().includes("yes")){
            openLogin();
        }else{
            add("👍 Continuing as Guest.","bot");
            loginStage=2;
        }
        return;
    }

    typing(true);

    try{
        let res=await fetch("/chat",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:text})
        });

        let data=await res.json();
        typing(false);
        add(data.reply,"bot");
    }
    catch{
        typing(false);
        add("⚠️ Server error","bot");
    }
}

window.onload=function(){
    add("👋 Welcome to BOT-BOY!","bot");
};
