const express = require("express");
const { generateRandomString, urlsForUser, findUserByEmail } = require('./helpers.js')
// creating an Express app
const app = express();

const PORT = 8080; // default port 8080

//setting ejs as template engine
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

//bcrypt
const bcrypt = require('bcrypt');

//require cookie session
cookieSession = require('cookie-session');

// cookie session Middleware
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});




// Databases
const users = {};
const urlDatabase1 = {}


// end points || routes


app.get("/", (req, res) => {
  res.redirect("/register");
});

// Displays urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase1);
});

// Diplays the main page
app.get("/urls", (req, res) => {
  const id = req.session.user_id;
  if (!id) {
    res.redirect('/login_form');
  } else {
    const urlsName = urlsForUser(id, urlDatabase1);
    const templateVars = {
      urls: urlsName,   //urlsForUser(id,urlDatabase1),
      username: users[id]
    };
    res.render("urls_index", templateVars);
  }
});

//Route to register new users
app.get('/register', (req, res) => {
  const templateVars = {
    urls: urlDatabase1,
    username: req.session["user_id"]
  };
  res.render('register', templateVars);
});

// Route allows user create new urls 
app.get("/urls/new", (req, res) => {
  if (!req.session['user_id']) {
    res.redirect('/login_form');
  } else {
    const user_id = req.session['user_id'];
    const templateVars = {
      username: users[user_id]
    };
    res.render("urls_new", templateVars);
  }
});

// Route allows user to view urls
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  let longURL = urlDatabase1[req.params.shortURL]['longURL'];
  if (!longURL) { 
    res.redirect(403).send("Incorrect url, please edit, tip: added http:/ to the url"); 
  } else {
    res.redirect(longURL); 
  } 
});

// Route allows user to edit the longUrls
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const id = req.session['user_id'];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase1[shortURL]['longURL'],
    username: users[req.session['user_id']]
  };
  res.render("urls_show", templateVars);
});

// Route to display the login form
app.get('/login_form', (req, res) => {
  let userID = req.session['user_id'];
  const tempname = {
    username: userID
  }
  res.render('login_form', tempname);
})

// Route that allows user to his urls if user in logged in 
app.post("/urls", (req, res) => {
  const urlName = generateRandomString();
  urlDatabase1[urlName] = { longURL: req.body.longURL, userID: req.session['user_id'] };
  res.redirect('/urls'); 
  
});

// Route that allows the user to delete his exisiting longUrls
app.post('/urls/:shortURL/delete', (req, res) => {
  const id = req.params.shortURL;
  delete urlDatabase1[id];
  res.redirect('/urls');
});

//Route to update the database with new url
app.post('/urls/:id', (req, res) => {
  const shortURL = req.params.id;
  const userID = req.session['user_id'];
  const urlBelongsToUser = urlDatabase1[shortURL] && urlDatabase1[shortURL].userID === userID;
  if (urlBelongsToUser) {
    urlDatabase1[shortURL]['longURL'] = req.body.Url;
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session['user_id']]
    }
    res.render('errorPage', templateVars);
  }
})

// Route to logout if the user is logged in.
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// Route allows user to register for new account.
app.post('/register', (req, res) => {
  const loginInfo = (req.body)
  const password = req.body.password
  const email = req.body.email
  let user_id = generateRandomString();
  if ((email.length === 0) || (password.length === 0)) {
    return res.status(400).send("Email or Password is not valid");
  } else if (findUserByEmail(email, users)) {
    return res.status(400).send("Email is already in use, please Login");
  } else {
    users[user_id] = {
      id: user_id,
      email: req.body.email,
      password: bcrypt.hashSync(password, 10)
    }
    req.session['user_id'] = user_id;
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // find the user exists in database
  const userFound = findUserByEmail(email, users);
    if (!userFound) { // if user not found
    res.status(403).send("Email not found, please Register");
  } if (!bcrypt.compareSync(password, userFound.password)) { // if password is incorrect.
    res.status(403).send("Invalid password");
  } else {
    req.session['user_id'] = userFound.id;
    res.redirect('/urls');
  }
});
