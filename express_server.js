const express = require("express");

// creating an Express app
const app = express();

const PORT = 8080; // default port 8080

//setting ejs as template engine
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));
let cookieParser = require('cookie-parser')
app.use(cookieParser());



app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});
// datebase => shortUrl and longUrl
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "4mp89x": "http://amazon.ca"
};

// end points || routes

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  console.log("received request")
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
});
// route to edit
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL)
  console.log("edit")
  console.log("tinyapp")
  const templateVars = {
     shortURL: req.params.shortURL,
      longURL: urlDatabase[shortURL],
      username: req.cookies["username"]
      };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body.longURL);  // Log the POST request body to the console
  const urlName = generateRandomString();
  urlDatabase[urlName] = req.body.longURL;
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// new code added for delete
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params)
  // extract the id from the path :req.params.shortUrl
  const id = req.params.shortURL
  // delete the entry for that id in database
  delete urlDatabase[id]
  //redirect to tinyap
  res.redirect('/urls');
});

//route to update the database with new url
app.post('/urls/edit/:shortURL', (req, res) => {
  console.log(req.params.shortURL)
  const id = req.params.shortURL
  console.log(req.body)
  urlDatabase[id] = req.body.Url
  res.redirect('/urls')
})

// Login route
app.post('/login', (req, res) => {
  const cookieName = req.body.username
  res.cookie("username", cookieName)
  console.log(cookieName)
  res.redirect('/urls')
})
// Logout route
app.post('/logout', (req, res) => {
  //   const cookieName = req.body.username
  //   res.cookie("username",cookieName) 
  //   console.log(cookieName)
  res.clearCookie('username', req.body.username )
     res.redirect('/urls')
})

app.get('/register', (req, res) =>{
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render('register',templateVars)
})

//function to generate random 6 digit alphanumeric string
function generateRandomString() {
  let result1 = "";
  let result = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;

  for (let i = 0; i < 6; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }

  return result.join('');

}
