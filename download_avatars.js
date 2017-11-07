var request = require('request');
var secret = require('./secret');
var fs = require('fs');
var args = process.argv;

function getRepoContributors(repoOwner, repoName, callback) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authentication': 'token ' + secret
    }
  }
  request(options, function(err, res, body) {
    callback(err, JSON.parse(body));
  });
};


function downloadImageByURL(url, filePath) {
  request.get(url)
    .pipe(fs.createWriteStream(filePath));
}

console.log('Welcome to the GitHub Avatar Downloader!');

getRepoContributors(args[2], args[3], function(err, result) {
  for(var i = 0; i < result.length; i++){
    downloadImageByURL(result[i].avatar_url, './avatars/' + result[i].login);
  }
});





