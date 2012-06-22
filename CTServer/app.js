
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes'),
us = require('underscore'),
nano = require("nano")("http://localhost:5984"),
trackers = nano.use("trackers");

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
   res.contentType("application/json");
   trackers.list(function(err, body){
      if(!err){
          res.send(body);;
      } 
   });
});

app.get('/trackers/get/:user', function(req, res){
    res.contentType("application/json");
    trackers.get(req.params.user, {}, function(err, body){
        
        res.send(body); 
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

app.post('/addUser', function(req, res){
    trackers.insert({}, req.body.user, function(err, body){
        res.send("success");
    });
});

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
