var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/static', {
	index: false
}));
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.get('/workspace', function(req, res){
	res.render('workspace', {});
});

app.listen(8080);
console.log("Server listening on port 8080");
