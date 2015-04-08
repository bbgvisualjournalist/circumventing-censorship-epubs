var express = require('express');
var router = express.Router();

/* Display all of the different translations of the book */
router.get('/', function(req, res, next) {
	var mode = req.query.mode;
	console.log("mode: "+mode);
	var languages = global.languages;
	var data = global.overview.sitewide;

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	var pathPrefixImage = '../'
	if (mode == 'export'){
		pathMode = '';
		pathPrefixImage = '';
	}

	res.render('index', { 
		title: 'Circumvention ebook',
		languages: languages,
		data: data,
		pathPrefix: pathMode,
		pathPrefixImage: pathPrefixImage
	});
});


/* Create content.opf. (This is an xml document so look at the source code)*/
router.get('/:language/content.opf', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];
	var overviewEnglish = global.overview.sitewide[0];
	var keywords = overview.metakeywords;
	var toc = global.toc[language];
	var images_array = global.images_array;

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}

	keywords = keywords.split(", ");
	console.log(keywords);

	var d = new Date().toISOString();
	d = d.replace(/\..*Z/, 'Z');//Removes decimal values that throw errors.

	var originalPubDate=overview.datepublished;
	originalPubDateFormatted = new Date(originalPubDate).toISOString();
	originalPubDateFormatted = originalPubDateFormatted.replace(/\..*Z/, 'Z');

	res.render('content', { 
		language: language,
		data: overview,
		dataEnglish: overviewEnglish,
		keywords: keywords,
		images_array: images_array,
		direction: direction,
		toc: toc,
		date: d,
		pubDate: originalPubDateFormatted
	});
});



/* Display cover.xhtml. */
router.get('/:language/cover.xhtml', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}

	res.render('cover', { 
		language: language,
		data: overview,
		direction: direction,
		pathPrefix: pathMode
	});
});

/* Display cover.xhtml. */
router.get('/:language/coverExport.xhtml', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];


	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}


	res.render('coverExport', { 
		language: language,
		data: overview,
		direction: direction,
		pathPrefix: pathMode
	});
});




/* Display titlepage.xhtml. */
router.get('/:language/titlepage.xhtml', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('titlepage', { 
		language: language,
		data: overview,
		direction: direction,
		pathPrefix: pathMode
	});
});




/* Display toc.xhtml. */
router.get('/:language/toc.xhtml', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];
	var toc = global.toc[language];
	var dictionary = global.dictionary[language];

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}

	res.render('toc', { 
		language: language,
		data: overview,
		toc: toc,
		direction: direction,
		dictionary: dictionary,
		pathPrefix: pathMode
	});
});


/* Display toc.ncx. */
router.get('/:language/toc.ncx', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];
	var toc = global.toc[language];
	var dictionary = global.dictionary[language];

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	if (mode == 'export'){
		pathMode = ''
	}


	res.render('tocncx', { 
		language: language,
		data: overview,
		toc: toc,
		direction: direction,
		dictionary: dictionary,
		pathPrefix: pathMode,
	});
});






/* Display introduction.xhtml. */
router.get('/:language/introduction.xhtml', function(req, res, next) {
	var language = req.params.language;
	var overview = global.overview[language];
	var toc = global.toc[language];

	console.log('language: ' + language);

	var direction = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
	}


	//ADD THE PATH PREFIX
	var mode = req.query.mode;
	console.log("mode: "+mode);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../';
	var pathPrefixImage = '../'
	var pathSuffix = ''
	if (mode == 'export'){
		pathMode = '';
		pathPrefixImage = '';
		pathSuffix = '.xhtml';
	}


	//ADD THE LINK FOR THE LANGUAGE SPECIFIC PARTIAL FOR THE INTRODUCTION
	var partial = 'partials/content/' + language + '_overview.ejs';

	res.render('introduction', { 
		language: language,
		data: overview,
		toc: toc,
		direction: direction,
		pathPrefix: pathMode,
		pathPrefixImage: pathPrefixImage, 
		pathSuffix: pathSuffix, 
		partial: partial
	});
});


/* Display the specific tools e.g. dns. */
router.get('/:language/:tool', function(req, res, next) {
	var language = req.params.language;
	var tool = req.params.tool;

	var overview = global.overview[language];
	var toc = global.toc[language];
	var toolData = global[tool][language];

	var direction = 'ltr';
	var directionComics = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
		directionComics = '_rtl';
	}


	//ADD THE PATH PREFIX
	var mode = req.query.mode;
	console.log("mode: " + mode);

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../../';
	var pathPrefixImage = '../'
	if (mode == 'export'){
		pathMode = '';
		pathPrefixImage = '';
	}


	//ADD THE LINK FOR THE LANGUAGE SPECIFIC PARTIAL FOR THE TOOL
	var partial = 'partials/content/' + language + '_' + tool +'.ejs';
	var partialComic = 'partials/comics/comic_' + tool +'.ejs';


	res.render('bodymatter', { 
		language: language,
		data: overview,
		toolData: toolData,
		toc: toc,
		tool: tool,
		mode: mode,
		direction: direction,
		directionComics: directionComics,
		pathPrefix: pathMode,
		pathPrefixImage: pathPrefixImage,
		partial: partial,
		partialComic: partialComic
	});
});



/* Display the comics */
router.get('/comics/:language/:tool', function(req, res, next) {
	var language = req.params.language;
	var tool = req.params.tool;
	var overview = global.overview[language];
	console.log('direction: '+ overview.direction)

	var direction = '';
	var directionComics = '';
	if (overview.direction=='rtl'){
		direction = 'rtl';
		directionComics = '_rtl';
	}

	//edit this for exporting to epub so that paths match up
	//specifically for head.js with the CSS
	var mode = req.query.mode;
	var pathMode = '../../../';
	var pathPrefixImage = '../'
	if (mode == 'export'){
		pathMode = '';
	}


	//ADD THE LINK FOR THE LANGUAGE SPECIFIC PARTIAL FOR THE TOOL
	var partial = 'partials/comics/comic_' + tool +'.ejs';

	var toolData = global[tool][language];

	res.render('tool', {
		title: 'Express',
		language: language,
		pathPrefix: pathMode,
		direction: direction,
		directionComics: directionComics,
		toolData: toolData,
		partial: partial
	});
});





module.exports = router;