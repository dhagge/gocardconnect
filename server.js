// Simple node server

var path = require('path'),
    bodyParser = require('body-parser'),
    express = require('express'),
    hbs  = require('express-hbs'),
    app = express();

var environment = process.env.NODE_ENV;
console.log('Runnning with environment ' + environment);

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

app.get('/confirmation/test', (req, res) => {
    res.render('manualConfirmationTest');
});

// serve up all /forms requests statically from app
function serveConfirmation(req, res) {
    //console.log(req.body);
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
        ccPostbackUrl: `https://${req.hostname}/confirmation/${practice}`,
        ccId: 'ArSjNri9Fjn77lgLmaEjBE0HwOJufOB5mGvZ77AizGgZj7KpTzlQhWADf9js6oHFDErgopE9vG98qhM8oEW8RI8ZmImtgNLdr7Ljwaar78HI44x8gXE39IdcHHKjwRE85zzRUpnVywfhTyWYu28i5iJR36cBQU3Gh6BBKu5Y6GY='
    }

    // if env is development use the dev creds
    if (environment === 'development' || !environment) {
        conf[ccId] = 'kEyvTIehNHAeWwDpblCLyTisSa4a62ywJC7Aam623HCMCmbn7m8ZkXwMnlPSd3bsArqefNj4Pq46Xtnxi6neZEzp/lL87SfiIzlg5YEaFcOmFa3XbcvVP0JeFl36ax0SGv73E9Q2Ez2aouIUvsAyRiNUUmFm8evaCQg8KcB/ScY=';
    }
    res.render('billPayForm', conf);

});

app.listen(8080);
console.log('Server listening on http://localhost:8080');