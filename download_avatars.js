
const env = require('dotenv').config();
//Error checking to see if the .env file is there
if (env.error) {
  console.log('Error: Env file not found!');
  return;
}

const request = require('request');
const fs = require('fs');
const args = process.argv;

/**
 * Gets the repo contributors in an object and feeds it to a callback function
 * @param  {STRING}   repoOwner owner of the repo
 * @param  {STRING}   repoName  the name of the repo
 * @param  {STRING}   accessToken  the profile access token for GitHub
 * @param  {Function} callback  function we will be calling on the contributors
 */
function getRepoContributors(repoOwner, repoName, accessToken, callback) {
  const options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + accessToken
    }
  }
  //error checking conditions. Throws error message if caught.
  if (repoOwner === undefined || repoName === undefined){
    console.log('Error: Missing arguments!');
  } else if (args.length > 4){
    console.log('Error: Too many parameters!');
  } else if (accessToken === undefined){
    console.log('Error: Missing token in .env file!');
  } else {
    request(options, function(err, res, body) {
      const bodyObj = JSON.parse(body);
      //Additional error checking to see if the credentials are correct
      if(bodyObj['message'] === 'Bad credentials'){
        console.log('Error: Bad credentials!');
      } else if(bodyObj['message'] === 'Not Found'){
        console.log('Error: Repo not found!');
      } else {
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

getRepoContributors(args[2], args[3], process.env.GITHUB_API_TOKEN, function(err, result) {
    for(var i = 0; i < result.length; i++){
      downloadImageByURL(result[i].avatar_url, './avatars/' + result[i].login);
    }
});






