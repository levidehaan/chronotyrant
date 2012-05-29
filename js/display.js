window.id = "display";

$(document).ready(function(){

    updateDisplayProjects();

    

    $('#project').on("change",function(e) {
        
        var time = chrome.extension.getBackgroundPage().getTime(),
        selected = $("#project :selected"),
        selectedName = selected.html(),
        selectedValue = selected.val(),
        store = {};
        
        store[time.ymdhm] = {name: selectedName, value: selectedValue};
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
        }else{
            localStorage.timeStore = JSON.stringify(store);
        }
        
        window.close();
    });

    $('#break5').on("change",function(e) {
    
        var time = chrome.extension.getBackgroundPage().getTime(),        
        store = {};
        
        store[time.ymdhm] = {name: "5minbreak", value: 0};
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
        }else{
            localStorage.timeStore = JSON.stringify(store);
        }
    
        window.close();
    });

    $('#break15').on("change",function(e) {
    
        var time = chrome.extension.getBackgroundPage().getTime(),    
        store = {};
        
        store[time.ymdhm] = {name: "15minbreak", value: 0};
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
        }else{
            localStorage.timeStore = JSON.stringify(store);
        }
    
        window.close();
    });

    $('#break30').on("change",function(e) {
    
        var time = chrome.extension.getBackgroundPage().getTime(),        
        store = {};
        
        store[time.ymdhm] = {name: "30minbreak", value: 0};
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
        }else{
            localStorage.timeStore = JSON.stringify(store);
        }
    
        window.close();
    });

    $('#DFD').on("change",function(e) {
    
        var time = chrome.extension.getBackgroundPage().getTime(),        
        store = {};
        
        localStorage.enabled = false;
        
        store[time.ymdhm] = {name: "Done For The Day", value: 0};
        if(localStorage.timeStore){
            var timeStore = getTimeStore();
            $.extend(timeStore, store);
            localStorage.timeStore = JSON.stringify(timeStore);
        }else{
            localStorage.timeStore = JSON.stringify(store);
        }
    
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