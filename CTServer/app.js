
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes'),
us = require('underscore'),
nano = require("nano")("http://localhost:5984"),
trackers = nano.use("trackers"),
usertrackers = nano.use("usertrackers");


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});



// Routes

app.get('/', routes.index);

app.get('/trackers/userList', function(req, res){
   trackers.list(function(err, body){
      if(!err){
          res.json(body);
      } 
   });
});

app.get('/userTrackers/userList', function(req, res){
   usertrackers.list(function(err, body){
      if(!err){
          res.json(body);
      } 
   });
});

app.get('/trackers/get/:user', function(req, res){
    trackers.get(req.params.user, {}, function(err, body){
        
        res.json(body); 
    })
});

app.get('/userTrackers/get/:user', function(req, res){
    trackers.get(req.params.user, {}, function(err, body){
        
        res.json(body); 
    })
});

app.post('/trackers/set/:user', function(req, res){
    
    trackers.get(req.params.user, {}, function(err, body){
        console.log(body);
                
        us.extend(body.TrackerInfo, req.body);
        
        console.log(body);
        
        trackers.insert(body, req.params.user, function(err, body){
            console.log(err);
            console.log(body);
            res.send("success");
        });
    });
});

app.post('/userTrackers/set/:user', function(req, res){
    
    usertrackers.get(req.params.user, {}, function(err, body){
        console.log(body);
                
        us.extend(body.TrackerInfo, req.body);
        
        console.log(body);
        
        usertrackers.insert(body, req.params.user, function(err, body){
            console.log(err);
            console.log(body);
            res.send("success");
        });
    });
});

app.post('/addUser', function(req, res){
    trackers.insert({}, req.body.user, function(err, body){
        res.send("success");
    });
});

app.post('/userTrackers/addUser', function(req, res){
    usertrackers.insert({}, req.body.user, function(err, body){
        res.send("success");
    });
});

app.listen(3000, function(){
    console.log("ChronoTyrant listening on port %d in %s mode", app.address().port, app.settings.env);
});
