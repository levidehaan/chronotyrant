window.id = "background";

loadScript("js/jquery.min.js", jqueryloader);

function jqueryloader () {
    
    if (!localStorage.isInitialized) {
        localStorage.isActivated = true;   
        localStorage.frequency = 1;        
        localStorage.isInitialized = true; 
    }
    
    console.log("calling setTimer jqueryloader");
    
    if (window.webkitNotifications) {
        if (JSON.parse(localStorage.isActivated)) {
            show();
        }
    }
    
    loadScript("js/amplify.min.js", function(){
        if(typeof amplify.store("server") != "undefined"){
    
            var ct = "http://"+amplify.store("server").ip+":"+amplify.store("server").port;

            amplify.request.define("addTracker", "ajax", {
                type: "POST",
                url : ct + "/trackers/set/"+amplify.store("username"),
                dataType : "json",
                decoder : function(data, status, xhr, success, error) {

                    if(xhr.status === 404) {
                        console.log("404");
                        error('404');
                    }
                    if(status === "error") {
                        console.log("error: ");
                        error();
                    }
                    success(data);
                },
                cache : false
            });
        }
        chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
            if( request && (request.id == "saveTrackerData")){
                ampAddTracker(request.data);
            }
            if(request && (request.msg === "ishour")){
                sendResponse({
                    msg: activeThisHour()
                });
            }
        });
    });

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
        console.log("calling setTimer show()");
        setTimer();
    }
}

function setTimer(){
    console.log("setTimer Called");
    setTimeout(function() {
        if(activeThisHour()){
            console.log("calling show setTimer()");
            show();
        }else{
            console.log("calling setTimer setTimer()");
            setTimer();
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

function ampAddTracker(data) {

    amplify.request({
        resourceId : "addTracker",
        data: data,
        success : function(retdata) {
            console.log(retdata);
        },
        error : function(data) {
            console.log('error: ');
            console.log(data);
        }
    });
}

