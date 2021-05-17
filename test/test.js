const { assert } = require('chai')

//const {generateRandomString, urlsForUser, findUserByEmail} = require('../helpers')
const {urlsForUser, generateRandomString} = require('../helpers')


//Databases
const UrlDatabase1 = {
  
    b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
    i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "abcd"
  }
}
// test userID in database and extract all the urls for the user ID

describe('urlsForUser', function() {
  it('should return urls for user if has userID in database', function() {
    const urls = urlsForUser('aJ48lW', UrlDatabase1);
    const expectedOutput ={
      b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
    }
    assert.deepEqual(urls,expectedOutput);
  });

  it('should return not found if the urls are not present in database', function() {
    const urls = urlsForUser("aJ48lw", UrlDatabase1);
    const expectedOutput = {};
    assert.deepEqual(urls,expectedOutput);
  });
})

describe('generateRandomString', function() {
  it('it should return an alphanumeric ID with length of 6 characters', function() {
    const alpha = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(alpha, expectedOutput);
  });

});
