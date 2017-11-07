const env = require('dotenv').config();


const request = require('request');
const fs = require('fs');


const args = process.argv;

function getRepoContributors(repoOwner, repoName, callback) {
  const options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_API_TOKEN
    }
  }

  if (args[2] === undefined || args[3] === undefined){
    console.log('Error! Missing arguments!');
  } else if (args.length > 4){
    console.log('Too many parameters!');
  } else if (process.env.GITHUB_API_TOKEN === undefined){
    console.log('Error! Missing token in .env file!!');
  } else if (result.message === 'Bad credentials'){
    console.log('Bad credentials!');
  } else {
    request(options, function(err, res, body) {
      callback(err, JSON.parse(body));
    });
  }
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






