/*
* Messages:
* 100: action executed successfully
* 400: couldn't add URL, most likely the vanity url is already taken
* 401: the URL isn't reachable
* 402: the "URL" parameter isn't set
* 403: the vanity string contains invalid characters
* 404: the short link doesn't exist
* 405: the vanity string can't be longer than 15 characters
* 406: the URL can't be longer than 1000 characters
* 407: the vanity string has to contain more characters
*/
var mysql = require("mysql");
var req = require("request");
var cons = require("./constants");
var crypto = require('crypto');
var axios = require('axios');
var pool = mysql.createPool({
		host:cons.host,
		user:cons.user,
		password:cons.password,
		database:cons.database
	});

//onSuccess: the method which should be executed if the hash has been generated successfully
//onError: if there was an error, this function will be executed
//retryCount: how many times the function should check if a certain hash already exists in the database
//url: the url which should be shortened
//request / response: the request and response objects
//con: the MySQL connection
//vanity: this should be a string which represents a custom URL (e.g. "url" corresponds to d.co/url)
function generateHash(onSuccess, onError, url, request, response, con) {
	var hash = "";
		//This section creates a string for a short URL on basis of an SHA1 hash
		var shasum = crypto.createHash('sha1');
		shasum.update(url+"");
		hash = shasum.digest('hex').substring(0, 8);
	
	//This section query's (with a query defined in "constants.js") and looks if the short URL with the specific segment already exists
	//If the segment already exists, it will repeat the generateHash function until a segment is generated which does not exist in the database
    con.query(cons.checksegment_query.replace("{SEGMENT}", con.escape(hash)), function(err, rows){
		if(err){
			console.log(err);
		}
		 if (rows != undefined && rows.length == 0) {
            onSuccess(hash, url, request, response, con);
        }  else {
                onError(response, request, con, 400);
          
        }
    });
}

//The function that is executed when there's an error
//response.send sends a message back to the client
function hashError(response, request, con, code){
	response.send(urlResult(null, false, code));
}

//The function that is executed when the short URL has been created successfully.
function handleHash(hash, url, request, response, con){
	con.query(cons.add_query.replace("{URL}", con.escape(url)).replace("{SEGMENT}", con.escape(hash)).replace("{IP}", con.escape(getIP(request))), function(err, rows){
		if(err){
			console.log(err);
		}
	});
	response.send(urlResult(hash, true, 100));
}

//This function returns the object that will be sent to the client
function urlResult(hash, result, statusCode){
	return {
		url: hash != null ? cons.root_url+hash : null,
		result: result,
		statusCode: statusCode
	};
}

//This method looks handles a short URL and redirects to that URL if it exists
//If the short URL exists, some statistics are saved to the database
var getUrl = function(segment, request, response){
	pool.getConnection(function(err, con){
		con.query(cons.check_valid_url_query.replace("{SEGMENT}", con.escape(segment)), function(err, rows){
			var result = rows;
			//console.log(cons.check_valid_url_query.replace("{SEGMENT}", con.escape(segment)));
			if(!err && rows.length > 0){
			var country ='';
			axios.get(cons.COUNTRYAPI)
				.then(res =>{
				if(res.data.status==='success')
				{
					country= res.data.country;
					con.query(cons.insert_view.replace("{IP}", con.escape(getIP(request))).replace("{URL_ID}", con.escape(result[0].id)).replace("{COUNTRY}", con.escape(country)), function(err, rows){
						if(err){
							console.log(err);
						}
						con.query(cons.update_views_query.replace("{VIEWS}", con.escape(result[0].num_of_clicks+1)).replace("{ID}", con.escape(result[0].id)), function(err, rows){
							if(err){
								console.log(err);
							}
						});
					});
	
					
				}
				});

			response.redirect(result[0].url);
			}
			else{
				//response.send(urlResult(null, false, 404));
				response.redirect('not-found');
			}
			if(err){
				console.log(err);
			}
		});
		con.release();
	});
};

//This function adds attempts to add an URL to the database. If the URL returns a 404 or if there is another error, this method returns an error to the client, else an object with the newly shortened URL is sent back to the client.
var addUrl = function(url, request, response){
	pool.getConnection(function(err, con){
		if(url){
			url = decodeURIComponent(url).toLowerCase();
			generateHash(handleHash, hashError, url, request, response, con);
		
		}
		else{
			response.send(urlResult(null, false, 402));
		}
		con.release();
	});
};

//This method looks up stats of a specific short URL and sends it to the client
var getURLS = function(request, response){
	pool.getConnection(function(err, con){
			con.query(cons.get_query, function(err, rows){
			if(err || rows.length == 0){
				response.send({result: false, data:[]});
			}
			else{
				
				response.send({result: true,data:rows,domain:cons.root_url});
			}
		});
		con.release();
	});
};

//This function returns the correct IP address. Node.js apps normally run behind a proxy, so the remoteAddress will be equal to the proxy. A proxy sends a header "X-Forwarded-For", so if this header is set, this IP address will be used.
function getIP(request){
	return request.header("x-forwarded-for") || request.connection.remoteAddress;
}

exports.getUrl = getUrl;
exports.addUrl = addUrl;
exports.getURLS = getURLS;