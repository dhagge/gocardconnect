// Simple node server

var path = require('path'),
    bodyParser = require('body-parser'),
    express = require('express'),
    hbs  = require('express-hbs'),
    less = require('less'),
    path = require('path'),
    fs = require('fs'),
    config = require('./lib/config')
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
app.set('views', path.join(__dirname, '/views'));

// serve up all /img statically
app.get('/img/*', (req, res) => {
    res.sendFile(req.params[0], { root: __dirname + '/img' });
});

// serve up all /styles
app.get('/style/*', (req, res) => {
    try {
        var practice = req.params.practice;
        var filePath = path.join(__dirname, req.url.replace('.css', '.less'));

        fs.readFile(filePath, "utf8", (err, practiceLess) => {
            if (err) {
                res.status(404).send('Not found');
                console.log('Could not open ' + filePath, err);
                return;
            }

            var options = {
                filename: filePath
            };
            less.render(practiceLess, options, (err, css) => {
                if (err) {
                    res.status(500).send('Internal server error');
                    console.log('Could not render less ' + filePath, err);
                    return;
                }
                res.header('Content-type', 'text/css');
                res.send(css.css);
            });
        });
    } catch (err) {
        console.log('Could not serve css: ' + err);
        res.status(500).send('Internal server error');
    }
});

app.get('/confirmation/test', (req, res) => {
    res.render('manualConfirmationTest');
});

function getFormStyle(practice) { // our base form styles
    return `/style/${practice}/billpayform.css`;
}

// serve up all /forms requests statically from app
function serveConfirmation(req, res) {
    //console.log(req.body);
    var practice = req.params.practice;
    var conf = {
        formStyle: getFormStyle(practice),
        resp: req.body,
        hasError: (req.body.errorCode !== '00')
    }
    res.render('confirmation', conf);
}
app.get('/confirmation/:practice', serveConfirmation);
app.post('/confirmation/:practice', serveConfirmation);

app.get('/:practice', (req, res) => {
    if(req.url === '/favicon.ico') {
        res.status(404).send('Not Found');
    }

    var practice = req.params.practice;
    var conf = {
        formStyle: getFormStyle(practice),
        ccCssUrl: `https://${req.hostname}/style/${practice}/tfp-billpayform.css`,
        ccPostbackUrl: `https://${req.hostname}/confirmation/${practice}`,
        ccId: config[practice].ccId,
        entityIdentifierText: config[practice].entityIdentifierText || 'Patient Name',
        entityCCKey: config[practice].entityIdentifierCardConnectKey || 'patient_name' // the key that is passed to cardconnect as custom data
    }

    // if env is development use the dev creds
    if (environment === 'development' || !environment) {
        conf.ccId = 'kEyvTIehNHAeWwDpblCLyTisSa4a62ywJC7Aam623HCMCmbn7m8ZkXwMnlPSd3bsArqefNj4Pq46Xtnxi6neZEzp/lL87SfiIzlg5YEaFcOmFa3XbcvVP0JeFl36ax0SGv73E9Q2Ez2aouIUvsAyRiNUUmFm8evaCQg8KcB/ScY=';
    }
    res.render('billPayForm', conf);

});

app.listen(8080);
//console.log('Starting with routes: ' + JSON.stringify(app._router.stack, null, '  '));
console.log('Server listening on http://localhost:8080');
