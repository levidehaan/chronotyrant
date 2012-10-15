window.id = "display";

$(document).ready(function(){

    updateDisplayProjects();

    var time = chrome.extension.getBackgroundPage().getTime();
    console.log("Stored Time", time);
    
    $('#project').on("change",function(e) {
        
        var selected = $("#project :selected"),
        selectedName = selected.html(),
        selectedValue = selected.val(),
        store = {};
        
        store[time.ymdhm] = {
            name: selectedName, 
            value: selectedValue
        };
        
        console.log("storing: ", store);
        
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: timeStore
            });
        }else{
            localStorage.timeStore = JSON.stringify(store);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: store
            });
        }
        
        window.close();
    });

    $('#break15').on("click",function(e) {
        console.log("break 15 called");
        
        var store = {};
        
        store[time.ymdhm] = {
            name: "15minbreak", 
            value: 0
        };
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: timeStore
            });
        }else{
            localStorage.timeStore = JSON.stringify(store);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: store
            });
        }
        chrome.extension.getBackgroundPage().pauseTimerfor(15, time);
        window.close();
    });

    $('#break30').on("click",function(e) {
    
        var store = {};
        
        store[time.ymdhm] = {
            name: "30minbreak", 
            value: 0
        };
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: timeStore
            });
        }else{
            localStorage.timeStore = JSON.stringify(store);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: store
            });
        }
        chrome.extension.getBackgroundPage().pauseTimerfor(30, time);
        window.close();
    });

    $('#break45').on("click",function(e) {
    
        var store = {};
        
        store[time.ymdhm] = {
            name: "45minbreak", 
            value: 0
        };
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: timeStore
            });
        }else{
            localStorage.timeStore = JSON.stringify(store);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: store
            });
        }
        chrome.extension.getBackgroundPage().pauseTimerfor(45, time);
        window.close();
    });

    $('#DFD').on("click",function(e) {
    
        var store = {};
        
        store[time.ymdhm] = {
            name: "Done For The Day", 
            value: 0
        };
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: timeStore
            });
        }else{
            localStorage.timeStore = JSON.stringify(store);
            chrome.extension.sendRequest({
                id:"saveTrackerData", 
                data: store
            });
        }
        chrome.extension.getBackgroundPage().endTimerForTheDay(time);
        window.close();
    });

});

function updateDisplayProjects(){
    if(localStorage.trackers){
        var trackers = JSON.parse(localStorage.trackers);
        $.each(trackers, function(index, value){
            var option = $("<option/>", {
                value: value
            }).html(index);
            $('#project').append(option);
        });
    }
}

function getTimeStore(){
    if(localStorage.timeStore){
        return JSON.parse(localStorage.timeStore);
    }else{
        return false;
    }
}

function setTimeStore(store){
    var timeStore = getTimeStore();
    $.extend(timeStore, store);
    localStorage.timeStore = JSON.stringify(timeStore);
}