var	http = require('http'),
	util = require('util'),
	mu   = require('mu2'),
	jsdom = require('jsdom'),
	$ = require('jquery'),
	async = require('async'),
	director = require('director'),
	send = require('send'),
	url = require('url'),
	auth = require('http-auth'),
	
	//mongodb settings
	dbserver = '',
	dbport = ,
	dbname = '',
	dbuser = '',
	dbpass = '',
	collection_name = '',
	mongodb = require('mongodb'),
	BSON = mongodb.BSONPure,
	mongodbServer = new mongodb.Server(dbserver, dbport, {
		safe: false
	}),

	//only known by author
	editable = auth({
		authRealm: "Do you have permit to edit this?",
		authList: ['username:password']
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

		//create
		router.get('/', function() {
			var res = this.res;
			
			async.series([ dashboard_recent_slides ], function(err, results) {
				var recent_slides = results[0];
				var stream = mu.compileAndRender('index.html', {recent_slides: recent_slides});
				stream.pipe(res);
			})
		})

		//read
		router.get('/pre/:id', function(id) {
			var res = this.res;
			
			collection.find({_id: new BSON.ObjectID(id)}, function(err, data) {
				data.toArray(function(key, val) {
					if(val.length >= 1) {
						var markdown = val[0].markdown;
						var stream = mu.compileAndRender('presentation.html', {_id: id, data: markdown});
						stream.pipe(res);
					}
					else {
						res.end("not found")
					}
				})
			});
		})

		//update
		router.post('/save', function () {
			var res = this.res;
			res.writeHead(200, { 'Content-Type': 'application/json' })
			
			var id = this.req.body._id;
			var md = this.req.body.markdown;
			
			if(id != "") {
				collection.update({_id: new BSON.ObjectID(id)}, {$set: {markdown: md}}, function(err) {
					if (err) {
						console.log('Failed to update');
					} else {
						console.log('Successfully update ('+id+')');
					}
					res.end();
				})
			}
			else {
				collection.insert({markdown: md}, function(err, data) {
					if (data) {
						console.log('Successfully insert ('+data[0]._id.toString()+')');
					} else {
						console.log('Failed to insert');
					}
					res.end(data[0]._id.toString());
				})
			}
		})
		
		//update page
		router.get('/edit/:id', function(id) {
			var res = this.res;
			var req = this.req;
			editable.apply(req, res, function(username) {
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
						stream.pipe(res);
					}
					else {
						res.end("not found");
					}
				})
			})
		})

		//delete
		router.post('/delete', function () {
			var res = this.res;
			var id = this.req.body._id;
			if(id != "") {
				collection.remove({_id: new BSON.ObjectID(id)}, function(err, removed){
					if(err) {
						console.log('Failed to delete ('+id+')');
						res.end();
					} else {
						console.log('Successfully delete ('+id+')');
						res.end(id);
					}
				});
			}
			else {
				console.log('Nothing to delete');
				res.end();
			}
		})
		
		//serve files from assets/
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
