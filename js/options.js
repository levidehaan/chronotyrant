window.id = "options";

$(function() {
    $( "#tabs" ).tabs();
    $('#addButton').click(function(e){
        e.preventDefault();
        addTracker();
    });
    $('#removeButton').click(function(e){
        e.preventDefault();
        console.log("removing");
        removeTracker();
    });
    $("#saveServer").click(function(e){
        console.log("save server");
        e.preventDefault(); 
        var serverIP = $("#serverAddr").val();
        console.log(serverIP);
        amplify.store("serverIP", serverIP);
    });
    $("#saveUser").click(function(e){
        e.preventDefault();
        var username = $("#username").val();
        saveUser(username);
    });
    init();
});



function init(){
    setEnabled();
    updateViewWorkHours();
    getWorkHours();
    listTrackers();
}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    alert("i was called!" + request.msg);
    if(request && (request.msg === "ishour")){
        sendResponse({
            msg: activeThisHour()
        });
    }
});

function getWorkHours(){
    var checkedHours = [];
    $('#workHours').children().each(function(index, value){
        var hour = $(value);
        if($.isEmptyObject($.data(hour.get(0), 'events'))){
            hour.on("change", function(){
                getWorkHours(); 
            });
        }
    });
    
    $('#workHours').children(':checked').each(function(index, value){
        var hour = $(value);
        checkedHours[index] = hour.val();
    });
    
    setWorkHours(checkedHours);
    return checkedHours;
}

function setWorkHours(hrs){
    localStorage.workHours = JSON.stringify(hrs);
}

function updateViewWorkHours(){
    if(localStorage.workHours){
        var workhours = JSON.parse(localStorage.workHours);
        $.each(workhours, function(index, value){
            $('#workHours').children().each(function(windex, wvalue){
                if($(wvalue).val() == value){
                    $(wvalue).attr("checked", true);
                } 
            });
        });
    }
}

function activeThisHour(){
    if($.inArray(getTime().hour24, getWorkHours()) !== -1){
        return true;
    }else{
        return false;
    }
}

function addTracker(){
    var value = $('#newTrackerPoints').val(),
    name = $('#newTracker').val(), d= {};
    d[name] = value;
    if(name != "" && value.match(/\S/)){
        $('#newTracker').val(null);
        $('#newTrackerPoints').val(null);
        setTrackerVals(d);
        $('#trackers').append(new Option(name, value, true, false));
    }
}

function removeTracker(){
    $('#trackers :selected').each(function(data1, data2){
        var val = $(data2),
        toDel = val.html(),
        trackers = getTrackerVals();
        
        delete(trackers[toDel]);
        localStorage.trackers = JSON.stringify(trackers);
        val.remove();
    });
}

function getTrackerVals(){
    if(localStorage.trackers){
        return JSON.parse(localStorage.trackers);
    }else{
        return false;
    }
}

//takes a string or object
function setTrackerVals(value){
    var tracker = getTrackerVals();
    if(!tracker){
        tracker = {};
    }
    
    $.extend(tracker, value);
    
    localStorage.trackers = JSON.stringify(tracker);
}

function delTrackerVals(value){
    var tracker = getTrackerVals();
    if(tracker){
        delete(tracker[value]);
        localStorage.trackers = JSON.stringify(tracker);
    }
}

function listTrackers(){
    var trackers = getTrackerVals();
    if(trackers){
        $.each(trackers, function(index, value){
            $('#trackers').append(new Option(index, value, true, false));
        });
    }
}

function deactivate(isDeactivated) {
    options.style.color = isDeactivated ? 'graytext' : 'white';
    options.frequency.disabled = isDeactivated;
}

function getTime(){
    var time = {};
    time.formatted = /(..):(..)/.exec(new Date());
    time.hour24 = time.formatted[1];
    time.hour = time.formatted[1] % 12 || 12; 
    time.period = time.formatted[1] < 12 ? 'a.m.' : 'p.m.';
    return time;
}

function setEnabled(){
    
    if(localStorage.frequency){
        options.frequency.value = localStorage.frequency;
    }   
    
    if(localStorage.enabled){
        options.enabled.checked = JSON.parse(localStorage.enabled);
    }
    
    if (!options.enabled.checked) {
        deactivate(true);
    }
    
    options.enabled.onchange = function() {
        localStorage.enabled = options.enabled.checked;
        deactivate(!options.enabled.checked);
    };

    options.frequency.onchange = function() {
        localStorage.frequency = options.frequency.value;
    };
    
}

function diff (obj1,obj2) {
    var newObj = $.extend({},obj1,obj2);
    var result = {};
    $.each(newObj, function (key, value) {
        if (!obj2.hasOwnProperty(key) || !obj1.hasOwnProperty(key) || obj2[key] !== obj1[key]) {
            result[key] = [obj1[key],obj2[key]];
        }
    });
    return result;
}

var ct = "http://"+amplify.store("serverIP");

amplify.request.define("addTracker", "ajax", {
    type: "POST",
    url : ct + "/tracker/set/"+amplify.store("username"),
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

amplify.request.define("saveUser", "ajax", {
    type: "POST",
    url: "http://127.0.0.1:3000/addUser",
    dataType: "json",
    decoder: function(data, status, xhr, success, error){
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

function ampAddTracker(dfd, data) {

    amplify.request({
        resourceId : "addTracker",
        data: data,
        success : function(retdata) {
            dfd.resolve(retdata);
        },
        error : function(data) {
            console.log('error: ');
            console.log(data);
        }
    });
}

function saveUser(username){
    amplify.request({
        resourceId: "saveUser",
        data: {
            "user" : username
        },
        success: function(data){
            console.log(data);
        },
        error: function(data){
            console.log("ERROR:");
            console.log(data);
        }
    });
}