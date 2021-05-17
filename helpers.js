//databases - users, urlDatabase1
const users = {}
const urlDatabase ={}

// function to generate 6 digit alphanumeric shortUrl
function generateRandomString() {
  let result = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
};

//function to finds urls for the exiting user based on id
const urlsForUser = function (matchID,urlDatabase1) {
  let urls = {};
  for (url in urlDatabase1){
    if(urlDatabase1[url].userID === matchID){
      urls[url] = urlDatabase1[url];
    }
  }
  return urls;
};

//function to find the exsitng user's email
const findUserByEmail = (email,users) => {
  for (let userID in users) {
    if (users[userID]["email"] === email) {
      return users[userID];
    }
  }
  return false;
}

module.exports = {
  generateRandomString,
  urlsForUser,
  findUserByEmail
};