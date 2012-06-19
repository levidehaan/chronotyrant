
/*
 * GET home page.
 */

exports.index = function(req, res){
    switch(req.route.path){
        case "/":
            res.render('index', {
                title: 'Chrono Tyrant API'
            });
            break;
        case "/chez":
            res.render("chez", {
                title: 'chez'
            });
    }
};