
const env = require('dotenv').config();
//Error checking to see if the .env file is there
if (env.error) {
  console.log('Error! Env file not found!');
  return;
}

const request = require('request');
const fs = require('fs');
const args = process.argv;

/**
 * Gets the repo contributors in an object and feeds it to a callback function
 * @param  {STRING}   repoOwner owner of the repo
 * @param  {STRING}   repoName  the name of the repo
 * @param  {Function} callback  function we will be calling on the contributors
 */
function getRepoContributors(repoOwner, repoName, callback) {
  const options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + process.env.GITHUB_API_TOKEN
    }
  }

  //error checking conditions. Throws error message if caught.
  if (args[2] === undefined || args[3] === undefined){
    console.log('Error! Missing arguments!');
  } else if (args.length > 4){
    console.log('Too many parameters!');
  } else if (process.env.GITHUB_API_TOKEN === undefined){
    console.log('Error! Missing token in .env file!!');
  } else {
    request(options, function(err, res, body) {
      const bodyObj = JSON.parse(body);
      if(bodyObj['message'] === 'Bad credentials'){
        console.log('Bad credentials!');
      } else{
        callback(err, bodyObj);
      }
    });
  }
};

/**
 * downloads an image to a filepath
 * @param  {string} url      where the file is located on the internet
 * @param  {string} filePath where on the local machine to download the file
 */
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






