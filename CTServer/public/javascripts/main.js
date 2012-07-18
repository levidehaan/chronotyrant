function menus($scope){
    $scope.menus = [
        {"name" : "Bar Chart", "link": "#barchart", "icon": "icon-align-left"},
        {"name" : "Line Axis Chart", "link": "#lineaxischart", "icon": "icon-align-left"},
        {"name" : "Pie Chart", "link": "#piechart", "icon": "icon-align-left"}
    ];
    $scope.menus_other = [
        {"name" : "User List", "link": "#userlist", "icon": "icon-user"},
        {"name" : "Raw Data", "link": "#rawdata", "icon": "icon-cog"}
    ]
}

$(document).ready(function() {
        
    var trackers = JSON.parse(localStorage.trackers), timeStore = JSON.parse(localStorage.timeStore),
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