var http = require('http'),
    util = require('util'),
	mu   = require('mu2'),
	jsdom = require('jsdom'),
	$ = require('jquery'),
	async = require('async'),
	director = require('director'),
	cronJob = require('cron').CronJob,
	send = require('send'),
	url = require('url'),
	
	//mongodb settings
	dbserver = '',
	dbport = '',
	dbname = '',
	dbuser = '',
	dbpass = '',
	collection_name = '',
	mongodb = require('mongodb'),
	BSON = mongodb.BSONPure,
	mongodbServer = new mongodb.Server(dbserver, dbport, {
        safe: false
    }),

    //server settings
    svrport = 999;

mu.root = __dirname + '/templates'

//connect database
new mongodb.Db(dbname, mongodbServer, {w: 1}).open(function(error, client) {
    if (error) throw error;
    client.authenticate(dbuser, dbpass, function(err, val) {
        if (err) throw error;
        else {
			//select collection
            var collection = new mongodb.Collection(client, collection_name);
			console.log("Database Connected!")
			
			var router = new director.http.Router();

			router.get('/', function() {
				var res = this.res;
				
				async.series([ dashboard_recent_slides ], function(err, results) {
					var recent_slides = results[0];
					var stream = mu.compileAndRender('index.html', {recent_slides: recent_slides});
					util.pump(stream, res);
				})
			})
			
			router.get('/edit/:id', function(id) {
				var res = this.res;
				
				async.series([
					dashboard_recent_slides, 
					function(callback) {
						collection.find({_id: new BSON.ObjectID(id)}, function(err, data) {
							data.toArray(function(key, val) {
								if(val.length >= 1) {
									var markdown = decodeURIComponent(val[0].markdown);
									callback(null, markdown);
								}
								else {
									callback(null, "")
								}
							})
						});
					}], function(err, results) {
					var recent_slides = results[0];
					var markdown = results[1];
					
					if(markdown != "") {
						var stream = mu.compileAndRender('index.html', {_id: id, data: markdown, recent_slides: recent_slides});
						util.pump(stream, res);
					}
					else {
						res.end("not found");
					}
				})
			})
			
			router.post('/save', function () {
				var res = this.res;
				res.writeHead(200, { 'Content-Type': 'application/json' })
				
				var id = this.req.body._id;
				var md = this.req.body.markdown;
				
				if(id != "") {
					collection.update({_id: new BSON.ObjectID(id)}, {$set: {markdown: md}}, function(err) {
						if (err) {
							console.log('Failed to Update');
						} else {
							console.log('Successfully Update ('+id+')');
						}
						res.end();
					})
				}
				else {
					collection.insert({markdown: md}, function(err, data) {
						if (data) {
							console.log('Successfully Insert ('+data[0]._id.toString()+')');
						} else {
							console.log('Failed to Insert');
						}
						res.end(data[0]._id.toString());
					})
				}
			})
			
			router.get('/pre/:id', function(id) {
				var res = this.res;
				
				collection.find({_id: new BSON.ObjectID(id)}, function(err, data) {
					data.toArray(function(key, val) {
						if(val.length >= 1) {
							var markdown = val[0].markdown;
							var stream = mu.compileAndRender('presentation.html', {_id: id, data: markdown});
							util.pump(stream, res);
						}
						else {
							res.end("not found")
						}
					})
				});
			})
			
			router.get(/\/assets[^*]*/,  function() {
				var res = this.res;
				var req = this.req;
				send(req, url.parse(req.url).pathname)
				.root(__dirname)
				.on('error', function(err) {
					res.statusCode = err.status || 500;
					res.end(err.message);
				})
				.on('directory', function() {
					res.statusCode = 301;
					res.setHeader('Location', req.url + '/');
					res.end('Redirecting to ' + req.url + '/');
				})
				.pipe(res);
			});
			
			var dashboard_recent_slides = function(callback) {
				var id_arr = [];
				collection.find({}, function(err, data) {
					data.toArray(function(key, val) {
						$.each(val, function(k, v) {
							id_arr.push({_id: v._id});
							if(k == val.length - 1) {
								callback(null, id_arr);
							}
						})
					})
				});
			};
			
			http.createServer(function (req, res) {
				mu.clearCache();
				
				req.chunks = [];
				req.on('data', function (chunk) {
					req.chunks.push(chunk.toString());
				});
				
				router.dispatch(req, res, function (err) {
				  if (err) {
					res.writeHead(404);
					res.end();
				  }
				});

			}).listen(svrport, null);
        }
    });
});