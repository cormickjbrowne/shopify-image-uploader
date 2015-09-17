var request = require('request'),
    fs = require('fs'),
    config = require('./config.json')['development'],
    //url = "https://" + config.host + "/admin/products/2392275139/images.json",
    auth = "Basic " + new Buffer(config.username + ":" + config.password).toString("base64"),
    inputDir = 'loader/input',
    outputDir = 'loader/output';

var files = fs.readdir(inputDir, function (err, files) {
	if(err) console.log(err);

	files.forEach(function (fileName) {
		var imageInfo = fileName.match(/(\w+)-(\w+)-(\d+)-(FRONT|BACK|SIDE|DETAIL|SAMPLE)(\.jpe?g|\.png)/);

		if(imageInfo) {
			var productId = imageInfo[3],
			    image = fs.createReadStream('loader/input/' + fileName, {encoding: 'base64'}),
			    imageContents = "";
 
			image.on('data', function (chunk) {
				imageContents += chunk;
				console.log('chunk\n');
			});

			image.on('end', function () {

    				var payload = JSON.stringify({ "image": { "attachment": imageContents, "filename": fileName }}),
				    url = 'https://' + config.host + '/admin/products/' + productId + '/images.json';
				//	url = 'http://requestb.in/ucimfpuc';
				request({
					method: 'POST',
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
		}
	});
});
