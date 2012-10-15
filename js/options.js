window.id = "options";


$(function() {
    
    //Events and listeners
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
        var server = {};
        server.ip = $("#serverAddr").val();
        server.port = $("#serverPort").val();
        amplify.store("server", server);
        $("#usernameVals").show();
        enableServer();
    });
    
    $("#saveUser").click(function(e){
        e.preventDefault();
        var username = $("#username").val();
        amplify.store("username", username);
        ampSaveUser(username);
    });
    
    init();
    
    //interface settings
    if(typeof amplify.store("server") != "undefined"){
        enableServer();
        $("#usernameVals").show();
        
        $("#serverAddr").val(amplify.store("server").ip);
        $("#serverPort").val(amplify.store("server").port);
    }
    
    if(typeof amplify.store("username")){
        $("#username").val(amplify.store("username"));
    }
    
});



function init(){
    setEnabled();
    updateViewWorkHours();
    getWorkHours();
    listTrackers();
}


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

function enableServer(){
    if(typeof amplify.store("server") != "undefined"){
    
        var ct = "http://"+amplify.store("server").ip+":"+amplify.store("server").port;

        amplify.request.define("saveUser", "ajax", {
            type: "POST",
            url: ct + "/addUser",
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

        amplify.request.define("getUserList", "ajax", {
            type: "GET",
            url: ct + "/trackers/userList",
            dataType: "json",
            decoder: function(data, status, xhr, success, error){
                if(xhr.status === 404) {
                    console.log("404");
                    error('404');
                }
                if(status === "error") {
                    console.log("error: ");
                    error(error);
                }
                success(data);
            },
            cache: false
        });
    }
}

function ampGetUserList (){
   
    amplify.request({
        resourceId: "getUserList",
        success: function(data){
            return data;
        },
        error: function(data){
            return data;
        }
    });
}

function ampSaveUser(username){
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

//Numbers Breakdown

$(document).ready(function() {

var timeStore = getTimeStore(), frequency = getFrequency(), trackers = getTrackers(), template, templateData, dateContainer = false;

$.each(timeStore, function(index, value){
    
    var d = index.split(":");

    if(dateContainer){
        var d2 = dateContainer;
        if( (Date.equals(Date.parse(d[1]+"/"+d[2]+"/"+d[0]), d2[1]+"/"+d2[2]+"/"+d2[0])) == 0 ){
            templateData[] = value.name;
        }

    }else{
        
        templateData[] = value.name;
    }
    
    dateContainer = index.split(":");   
    
});

template = $("<div/>", {id: "template", class: "template"});

console.log(amplify.store("timeStore"));

$('#chartContainerNumbersBreakdown');

});

//Charting

$(document).ready(function() {
        
    var trackers = getTrackers(), timeStore = getTimeStore(),
    trackersArray = [], days = [], cta = 0, ctsa = 0;
    for(var a in trackers){
        trackersArray[cta++] = a;
    }
    for(var a in timeStore){
        var d = a.split(":"),
        day = d[1]+"/"+d[2]+"/"+d[0];
        
        if($.inArray(day, days) == -1){
            days[ctsa++] = day;
        }
    }     
         
    for(var d in days){
        $("<div/>", {
            "id":"container_"+d,
            "style":"width: 80%; height: 400px; margin: 0 auto"
        }).appendTo("#chartContainer");
        genCharts(Highcharts, timeStore, trackersArray, days, d)
    }
});
    
function findObject(name,val) {
    var len = this.length;
    for (var i=0; i<len; i++) {
        if (this[i][name]===val) {
            return i;
        }
    }
    return false;
}


//generate charts
function genCharts(Highcharts, timeStore, trackersArray, days, d){
            
            
    var timeStoreArray = [], ctsa2 = 0;
    
    for(var t in timeStore){
            
        var n = t.split(":"),
        day = n[1]+"/"+n[2]+"/"+n[0];
        
        if(day === days[d]){
        
            timeStoreArray.findObject = findObject;
            var filter = timeStoreArray.findObject("name", timeStore[t].name);
        
            if(filter !== false){
                timeStoreArray[filter] = {
                    name: timeStore[t].name,
                    data: [parseInt(timeStoreArray[filter].data) +1]
                };
            }else{
                timeStoreArray[ctsa2++] = {
                    name: timeStore[t].name,
                    data: [1]
                };
            }
        }
    }
    
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container_'+d,
            type: 'column'
        },
        title: {
            text: days[d]+' Time Use'
        },
        subtitle: {
            text: 'User: ' + amplify.store("username")
        },
        xAxis: {
            tickmarkPlacement: 'on',
            labels: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: 'Hits'
            }
        },
        tooltip: {
            formatter: function() {
                return Highcharts.numberFormat(this.y, 0, ',') +' Hits';
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: timeStoreArray
    });
            
        
}

function getTimeStore(){
    if(localStorage.timeStore){
        return JSON.parse(localStorage.timeStore);
    }else{
        return false;
    }
}

function getFrequency(){
    if(localStorage.frequency){
        return JSON.parse(localStorage.frequency);
    }else{
        return false;
    }
}

function getTrackers(){
    if(localStorage.trackers){
        return JSON.parse(localStorage.trackers);
    }else{
        return false;
    }
}

function setTimeStore(store){
    var timeStore = getTimeStore();
    $.extend(timeStore, store);
    localStorage.timeStore = JSON.stringify(timeStore);
}