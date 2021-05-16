// url Database
const urlDatabase1 = {
  b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};
//global object user database
const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("abcd", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("abcd", 10)
  }
};

function generateRandomString() {
  let result = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join('');

}


const urlsForUser = function (matchID,urlDatabase1) {
  let id = {}
  for (url in urlDatabase1){
    if(urlDatabase1[url].userID === matchID){
      id[url] = urlDatabase1[url]
    }
    
    
  }
  return id;
}


const findUserByEmail = (email) => {
  for (let userID in users) {
    if (users[userID]["email"] === email) {
      return users[userID]
      
    }
  }
  return false;
}
module.exports = {
  generateRandomString,
  urlsForUser,
  findUserByEmail
  
};