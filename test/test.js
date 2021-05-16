const { assert } = require('chai')
const asset = require('chai')
const {generateRandomString, urlsForUser, findUserByEmail} = require('../helpers')

const testUrlDatabase1 = {
  
    b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
    i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  
}

// test userID in database and extract all the urls for the user ID

describe('urlsForUser', function() {
  it('should return urls for user if has userID in database', function() {
    const userID = urlsforUser("aJ48lW", testUrlDatabase1);
    const exectedOutput ={
      b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
    }
    assert.deepEqual(actualOutput,expectedOutput)
  });

})

describe('urlsForUser', function() {
  it('should return not found if the urls are not present in database', function() {
    const userID = urlsforUser("aJ48lw", testUrlDatabase1);
    const exectedOutput ={
      b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
    }
    assert.deepEqual(actualOutput,expectedOutput)
  });

})