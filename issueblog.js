var http = require('http'),
	https = require('https'),
	fs = require('fs'),
	path = require('path'),
	prompt = require('prompt'),

	config = {
		hostName: 'api.github.com',
		userName: null,
		email: null,
		userHome: null,
		key: null
	},

	promptSchema = {
		properties: {
			userName: {
				description: 'Enter your github user name',
				pattern: /^[\w.-]+$/,
				message: 'Name must be only letters, numbers, ".", "-" or "_"',
				require: true
			},
			password: {
				description: 'Enter your github password',
				require: true
			}
		}
	},

	issueBlog = {

		_init: function(cb) {
			var self = this;
			config.userHome = process.env[(/win/.test(process.platform)) ? 'USERPROFILE' : 'HOME'];
			config.key = fs.readFileSync(path.resolve(config.userHome, '.ssh/id_rsa'));
			prompt.start();
			prompt.get(promptSchema, function(err, res) {
				if (err) throw err;
				// console.log('Your input info received:');
				// console.log('username: ' + results.username);
				// console.log('email: ' + results.email);
				config.userName = res.userName;
				config.password = res.password;
				cb.call(self);
			});
		},

		_listReps: function() {
			console.log('listing your repositories on github...');
			if (!config.userName) {
				console.warn('must set user name!');
				this._init(this._listReps);
				return;
			}
			var req = https.request({
				hostname: config.hostName,
				path: '/users/' + config.userName + '/repos',
				method: 'GET',
				// headers: {
				// 	'user-agent': 'node.js'
				// }
				key: config.key,
				// key: [config.key, /*config.password*/'']
				agent: false,
				// secureOptions: require('constants').SSL_OP_NO_TLSv1_2
			}, function(res) {
				var str = '';
				console.log('STATUS: ', res.statusCode);
				console.log('HEADERS: ', res.headers);
				res.on('data', function(chunk) {
					str += chunk;
				});
				res.on('end', function() {
					console.log('received: ', str);
				});
			});
			req.on('error', function(e) {
				console.log('error occurs: ', e);
			});
			// console.log(req);
		},

		_createBlog: function(cb) {

		},

		_run: function() {
			this._init(this._listReps);
		}

	};

// test. remove later.
issueBlog._run();

module.exports = {
	run: issueBlog._run
};


