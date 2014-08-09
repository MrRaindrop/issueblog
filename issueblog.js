var fs = require('fs'),
	path = require('path'),
	prompt = require('prompt'),
	Q = require('q'),
	ejs = require('ejs'),
	GithubApi = require('github'),

	config = {
		githubApiVersion: '3.0.0',
		userName: null,
		password: null,
		domainName: null,
		files: {
			'index.html': path.resolve(__dirname, 'init/index.html'),
			'CNAME': path.resolve(__dirname, 'init/CNAME')
		}
	},

	promptSchema = {
		properties: {
			userName: {
				description: 'Enter your github user name',
				required: true
			},
			password: {
				description: 'Enter your github password',
				required: true,
				hidden: true
			},
			domainName: {
				description: 'Enter the domain name for your blog,' +
					' press enter if you don\'t have one.',
			}
		}
	},

	github = null,

	blogRepo = null,

	_authOnce = function() {
		github.authenticate({
		    type: "basic",
		    username: config.userName,
		    password: config.password,
		});
	};

	_auth = function() {

	};

	_init = function() {
		_getUserInfo()
			.then(_initGithub)
			.then(_createRepo)
			.then(_loadFiles)
			.then(_firstCommit)
			.then(function(res) {
				console.log(res.length + ' files are added.\n' +
					'issueblog has been created on your github pages.\n' +
					'Your blog page should be available in at most 10 minutes.\n' +
					'Please check out this uri:\n' + 
					'https://' + config.userName + '.github.io\n' +
					'Enjoy it ! @issueblog');
			})
			.catch(function(err) {
				if (err.message === 'canceled') {
					console.log('bye!');
					process.exit(0);
				}
				if (err.code === 401) {
					console.log('issueblog-error: loginName or password is not valid.');
					return _init();
				} 
				if (err.code === 422) {
					console.log('issueblog-error: your already have a repository with name ' +
						config.userName + '.github.io');
					// TODO: prompt to delete this repository.
					return;
				}
				throw err;
			})
			.done();
	};

	_getUserInfo = function() {
		return Q.Promise(function(resolve, reject) {
			prompt.start();
			prompt.get(promptSchema, function(err, res) {
				if (err) {
					reject(err);
				} else {
					config.userName = res.userName;
					config.password = res.password;
					config.domainName = res.domainName;
					resolve();
				}
			});
		});
	};

	_initGithub = function() {
		github = new GithubApi({
			version: config.githubApiVersion,
			// debug: true,
			protocol: 'https',
			// host: 'github.com',
			// host: "github.my-GHE-enabled-company.com",
			// pathPrefix: "/api/v3",
			timeout: 10000
		});
	};

	_createRepo = function(user) {
		return Q.Promise(function(resolve, reject) {
			_authOnce();
			github.repos.create({
				name: config.userName + '.github.io',
				description: config.userName + '\'s blog - @issueblog',
				private: false,
				has_issues: true,
				has_wiki: true,
				has_downloads: true,
				auto_init: true
			}, function(err, res) {
				if (err) {
					reject(err);
				} else {
					blogRepo = res;
					resolve(res);
				}
			});
		});
	};

	_loadFiles = function() {
		var files = {}, paths = config.files;
		for (var k in paths) {
			files[k] = ejs.render(fs.readFileSync(paths[k], 'utf8'), config);
		}
		return files;
	};

	_firstCommit = function(files) {
		// _authOnce();
		var k, p = Q.fcall(function() {
			return Q(undefined);
		}), resArr = [];
		for (k in files) {
			p = p.then((function(path, content) {
				return function(data) {
					if (data && data.name) {
						console.log(data.name + ' created @' + new Date().getTime());
					}
					return Q.Promise(function(resolve, reject) {
						github.repos.createFile({
							user: config.userName,
							repo: blogRepo.name,
							path: path,
							message: 'add ' + path,
							content: new Buffer(content).toString('base64'),
						}, function(err, res) {
							if (err) {
								reject(err);
							} else {
								resArr.push(res);
								resolve(res);
							}
						});
					});
				}
			})(k, files[k]));
		}
		p = p.then(function(data) {
			if (data && data.name) {
				console.log(data.name + ' created @' + new Date().getTime());
			}
			return resArr;
		});
		return p;
	};

	_getRepos = function() {
		return Q.Promise(function(resolve, reject) {
			_authOnce();
			github.repos.getFromUser({
				user: config.userName + '',
				type: 'all',
				sort: 'updated',
				page: 1,
				per_page: 100
			}, function(err, res) {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			})
		});
	};

	_getFollowers = function() {
		return Q.promise(function(resolve, reject) {
			github.user.getFollowingFromUser({
			    // optional:
			    // headers: {
			    //     "cookie": "blahblah"
			    // },
			    user: "MrRaindrop"
			}, function(err, res) {
				if (err) {
					reject(err);
				} else {
			    	resolve(res);
				}
			});
		});
	};

	_listRepos = function() {

	};

	_createBlog = function(cb) {

	};

	_run = function() {
		_init();
	};

// local test
_run();

module.exports = {
	run: _run
};


