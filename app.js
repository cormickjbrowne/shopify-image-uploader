var request = require('request'),
    fs = require('fs'),
    config = require('./config.json')['development'],
    url = "https://" + config.host + "/admin/products/2392275139/images.json",
    auth = "Basic " + new Buffer(config.username + ":" + config.password).toString("base64");

var image = fs.createReadStream('loader/input/example.png', {encoding: 'base64'});
var imageContents = "";
 
image.on('data', function (chunk) {
	imageContents += chunk;
	console.log('chunk\n');
});

image.on('end', function () {
    	var payload = JSON.stringify({ "image": { "attachment": imageContents, "filename": "sample.png" }});

	request({
			method: "POST",
			uri: url,
			headers: { 
				'Authorization' : auth,
				'content-type': 'application/json'
			},
			body: payload

		}, function (err, response, body) {
			if(err) return console.log("Error = " + err);
			if(response.statusCode == 200) return //move file to output directory

			console.log(response.statusCode + " " + response.statusMessage);
	});
});

