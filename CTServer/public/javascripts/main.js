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