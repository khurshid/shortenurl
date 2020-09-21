	var logic = require('./logic');
	var route = function(app){
		app.get('/add', function(request, response){
			var url = request.param('url');
			logic.addUrl(url, request, response);
		});
		
		app.get('/urls', function(request, response){
			logic.getURLS(request, response);
		});
		
		app.get('/:segment', function(request, response){
			logic.getUrl(request.params.segment, request, response);
		});
	}

	exports.route = route;