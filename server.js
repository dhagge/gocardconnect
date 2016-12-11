// Simple node server

var path = require('path'),
    bodyParser = require('body-parser'),
    express = require('express'),
    hbs  = require('express-hbs'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs')
app.engine('hbs', hbs.express4({  
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', path.join(__dirname,'/views'));

// serve up all /styles
app.get('/style/*', (req, res) => {
    res.sendFile(req.params[0], { root: __dirname + '/style' });
});

// serve up all /forms requests statically from app
function serveConfirmation(req, res) {
    console.log(req.body);
    var conf = {
        formStyle: '/style/cardconnect/billpayform.css',
        resp: req.body
    }
    res.render('confirmation', conf);
}
app.get('/confirmation/:practice', serveConfirmation);
app.post('/confirmation/:practice', serveConfirmation);

app.get('/', function(req, res) {
    var practice = 'cardconnect';
    var conf = {
        formStyle: `/style/${practice}/billpayform.css`,
        ccCssUrl: `https://${req.hostname}/style/${practice}/tfp-billpayform.css`,
        ccPostbackUrl: `https://${req.hostname}/confirmation/${practice}`
    }
    res.render('billPayForm', conf);

});

app.listen(8080);
console.log('Server listening on http://localhost:8080');