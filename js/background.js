window.id = "background";

loadScript("js/jquery.min.js", jqueryloader);

function jqueryloader () {
    
    if (!localStorage.isInitialized) {
        localStorage.isActivated = true;   
        localStorage.frequency = 1;        
        localStorage.isInitialized = true; 
    }

    setTimer();

    if (window.webkitNotifications) {
        if (JSON.parse(localStorage.isActivated)) {
            show();
        }
    }
};

function loadScript(url, callback)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
}



function show() {
    console.log("show called");
    if (JSON.parse(localStorage.isActivated)) {
        window.webkitNotifications.createHTMLNotification("display.html").show();
    }
}

function setTimer(){
    setTimeout(function() {
        if(activeThisHour()){
            show();
        }
    }, (60000 * JSON.parse(localStorage.frequency)));
}

function getTime(){
    var time = {};
    time.date = new Date();
    time.formatted = /(..):(..)/.exec(time.date);
    time.hour24 = time.formatted[1];
    time.min = time.formatted[2];
    time.hour = time.formatted[1] % 12 || 12; 
    time.period = time.formatted[1] < 12 ? 'a.m.' : 'p.m.';
    time.day = time.date.getDate();
    time.year = time.date.getFullYear();
    time.month = time.date.getMonth();
    time.ymdhm = time.year + ":" + time.month + ":" + time.day + ":" + time.hour24 + ":" + time.min;
    return time;
}


function activeThisHour(){
    if($.inArray(getTime().hour24, workHours()) !== -1){
        return true;
    }else{
        return false;
    }
}

function workHours(){
    var checkedHours = JSON.parse(localStorage.workHours);
    return checkedHours;
}



