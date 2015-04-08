var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

var fs = require('fs');
var jf = require('jsonfile');
var Tabletop = require('tabletop');










//A simple function for reading files.
function readJSONFile( path ){
	var binaryData = fs.readFileSync( path );
	return JSON.parse( binaryData.toString() );
}


var sections = ['overview', 'dictionary', 'toc', 'dns', 'freegate', 'pgp', 'psiphon', 'tor', 'ultrasurf', 'vpn']
app.locals.sections = sections;
global.images_array = ['circumvention.png', 'comic_PGP_6.png', 'icons_bottomLine.png', 'icons_caution.png', 'icons_help_alt.png', 'icons_how.png', 'icons_trap.png', 'icon_anonymity.png', 'icon_check.png', 'icon_checkHover.png', 'icon_circumvention.png', 'icon_encryption.png', 'icon_portability.png']


global.fonts = {
	'english' : {
		'main' : 'Georgia, Times, "Times New Roman", serif',
		'altA' : 'Arial, sans-serif',
		'altB' : '"Oswald", Arial, sans-serif',
		'altC' : '"Amatic SC", Arial, sans-serif',
		'mono' : 'Courier, monospace',
		'href' : "<link href='http://fonts.googleapis.com/css?family=Amatic+SC|Oswald' rel='stylesheet' type='text/css' />"
	},
	'persian' : {
		'main' : 'Georgia, Times, "Times New Roman", serif',
		'altA' : 'Arial, sans-serif',
		'altB' : '"Oswald", Arial, sans-serif',
		'altC' : 'Arial, sans-serif',
		'mono' : 'Courier, monospace',
		'href' : '<link href="http://fonts.googleapis.com/css?family=Oswald" rel="stylesheet" type="text/css" />'
	},
	'russian' : {
		'main' : 'Georgia, Times, "Times New Roman", serif',
		'altA' : 'Arial, sans-serif',
		'altB' : '"Roboto Slab", Arial, sans-serif',
		'altC' : 'Arial, sans-serif',
		'mono' : '"Ubuntu Mono", monospace',
		'href' : "<link href='http://fonts.googleapis.com/css?family=Roboto:400,700,400italic|Ubuntu+Mono:400&subset=cyrillic-ext,latin-ext,latin,cyrillic' rel='stylesheet' type='text/css'>"
	}
};







for (var i = 0; i<sections.length; i++){
	//Use namespaced global variable to keep data that will update. 
	//EXAMPLE: global.freegate = {};
	global[sections[i]] = {};

	//Load data from saved JSON files into global variables.
	//EXAMPLE: global.overview.sitewide = readJSONFile('../data/sitewide.json');
	var filename = '../data/' + sections[i] + '.json'
	global[sections[i]].sitewide = readJSONFile(filename);


	//Create JSON branch for each language
	//global.overview[language] = global.overview.sitewide[i];
	for (var j = 0; j<global.overview.sitewide.length; j++){
		var language = global.overview.sitewide[j].language;
		global[sections[i]][language] = global[sections[i]].sitewide[j];
	}
}

//Used in the loop on the index page of ebook translations
global.languages = [];
for (var i = 0; i<global.overview.sitewide.length; i++){
	var language = global.overview.sitewide[i].language;
	global.languages[i]=language;
}


//Toggle for offline use; ignores Google spreadsheet request.
var offlineMode=false;


//Add a timer to periodically update data for edits.
//20000 = 20 seconds; 60000 = 1 minute ; 300000 = 5 minutes
setInterval(fetchData, 90000);


//Load data from google spreadsheet and write it to JSON files.
function fetchData(){
	if (!offlineMode){
		console.log('loading spreadsheet data.')
		var spreadsheet_URL = 'https://docs.google.com/spreadsheets/d/123DWrahipU6XOVjnVdTd0kdOBFBlzXuxButFymJ-OmA/pubhtml';


		var myData;
		function onLoad(data, tabletop) {
			console.log("loading, updating and saving data from spreadsheet");

			for (var i = 0; i<sections.length; i++){
				//create JSON branch for each language
				//global.overview[language] = global.overview.sitewide[i];
				for (var j = 0; j<global.overview.sitewide.length; j++){
					var language = global.overview.sitewide[j].language;
					global[sections[i]][language] = global[sections[i]].sitewide[j];
				}
			}

			//Write updated data to .JSON files and update global variables.
			var currentNumber=0;
			function writeJSON(){
				if(currentNumber<sections.length){
					var filename = '../data/' + sections[currentNumber] + '.json'
					
					jf.writeFile(filename, data[sections[currentNumber]].elements, function(err) {
						global[sections[currentNumber]].sitewide = readJSONFile(filename);

						currentNumber++;
						writeJSON();
					})
				}
			}
			writeJSON();
		};

		var options = {
			key: spreadsheet_URL,
			callback: onLoad
		};

		Tabletop.init(options);
	}
}










// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
