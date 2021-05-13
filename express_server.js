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

// datebase => shortUrl and longUrl
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "4mp89x": "http://amazon.ca"
};

// global object user database
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

//function of compare email if found

const findUserByEmail = (email) => {
  for(let userID in users) {
    if(users[userID]["email"] === email){
    return users[userID]
    }
  }
    return false;
}
//const userFound = findUserByEmail(email)
//console.log("userfound",userFound)

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
  //console.log("hi",req.sessions["user_id"])
  const templateVars = { 
    urls: urlDatabase, 
    username: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  const templateVars = { 
  username: req.cookies["username"]
  };
  
  res.render("urls_new", templateVars);
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
// app.post('/login', (req, res) => {
//   const cookieName = req.body.username
//   res.cookie("username", cookieName)
//   console.log(cookieName)
//   res.redirect('/urls')
// })
// Logout route
app.post('/logout', (req, res) => {
  //   const cookieName = req.body.username
  //   res.cookie("username",cookieName) 
  //   console.log(cookieName)
  res.clearCookie('user_id', req.body.username )
     res.redirect('/urls')
})

app.get('/register', (req, res) =>{
  const templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["user_id"]
  };
  res.render('register',templateVars)
});

app.post('/register', (req, res) => {
const loginInfo =(req.body)
//console.log(req.body)
let user_id = generateRandomString()
//console.log(userID)
console.log("before",users) 
if((req.body.email === "") || (req.body.password === "")) {
   return res.status(404)
}
 if (users[user_id]) {
  res.status(404)
} else {
  users[user_id] = {
  id : user_id,
  email: req.body.email,
  password: req.body.password
}
console.log("after",users) 
//user_id : req.cookies["user_id"]
res.cookie("user_id", user_id)
res.redirect('/urls')
}
})

// diplaying login_form
app.get('/login_form', (req,res)  =>{
console.log(req.cookies)
let userID = req.cookies['user_id']
const tempname = {
  username: userID
}


res.render('login_form',tempname)

})

app.post('/login', (req,res) => {
// extract email and password
const email = req.body.email
const password = req.body.password
console.log (email, password)

//find the user object that email
const userFound = findUserByEmail(email)

// if user found in db, then compare the password

  if(userFound && userFound.password === password){
//if they match , log the user in
console.log("hello",userFound)
res.cookie('user_id', userFound.id)  
res.redirect('/urls')
// res cookie

// else show error message
} else {
res.status(403).send("Email not found")

} 

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
