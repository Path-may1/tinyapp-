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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// datebase => shortUrl and longUrl
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "4mp89x": "http://amazon.ca"
};
const urlDatabase1 = {
  b6UTxQ: { longURL: "https://www.example.com", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
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
  for (let userID in users) {
    if (users[userID]["email"] === email) {
      return users[userID]
    }
  }
  return false;
}

// end points || routes

app.get("/", (req, res) => {
  console.log("logging res.cookies",req.cookies)
  //***** */ if the userid is present{
  //***res.redirect('/urls')
  // }else {
  res.redirect('/login_form')
  //
  //res.send("Hello!");
});

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}!`);
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase1);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  //console.log("hi",req.sessions["user_id"])
  const id = req.cookies['user_id']
  if(!req.cookies['user_id']){
    console.log(req.cookies['user_id'])
    res.redirect('/login_form')
  }else{
  const templateVars = {
    urls: urlsForUser(id,urlDatabase1),
    username: users[req.cookies["user_id"]]
  };
console.log(templateVars['urls'])

  res.render("urls_index", templateVars);
  }
});



// Create new urls page 
app.get("/urls/new", (req, res) => {
  if (!req.cookies['user_id']) {

    res.redirect('/login_form')
  } else {
    const user_id = req.cookies['user_id']
    console.log("user_id",user_id)
    const templateVars = {
      username: users[user_id]
    };
    //new code allowing users to access the urls/new page
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  console.log("received request")
  const shortURL = req.params.shortURL
  const longURL = urlDatabase1[shortURL]['longURL']
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
    longURL: urlDatabase1[shortURL]['longURL'],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log("this is post",req.body.longURL);  // Log the POST request body to the console
  const urlName = generateRandomString();
 console.log("urlName ", urlName)
 console.log("urlDatabase1[urlName]",urlDatabase1[urlName])
  //urlDatabase1[urlName] = req.body.longURL;
  urlDatabase1[urlName] = {longURL:req.body.longURL, userID : req.cookies['user_id']} 
  //urlDatabase1[urlName].longURL = req.body.longURL;
  console.log("display longurl",urlDatabase1[urlName]['longURL'])
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


// new code added for delete
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params)
  // extract the id from the path :req.params.shortUrl
  const id = req.params.shortURL
  // delete the entry for that id in database
  delete urlDatabase1[id]
  //redirect to tinyap
  res.redirect('/urls');
});

//route to update the database with new url
app.post('/urls/edit/:shortURL', (req, res) => {
  console.log(req.params.shortURL)
  const id = req.params.shortURL
  console.log(req.body)
  urlDatabase1[id] = req.body.Url
  res.redirect('/urls')
})


// Logout route
app.post('/logout', (req, res) => {
  //   const cookieName = req.body.username
  //   res.cookie("username",cookieName) 
  //   console.log(cookieName)
  res.clearCookie('user_id', req.body.username)
  res.redirect('/urls')
})

app.get('/register', (req, res) => {
  const templateVars = {
    urls: urlDatabase1,
    username: req.cookies["user_id"]
  };
  res.render('register', templateVars)
});

app.post('/register', (req, res) => {
  const loginInfo = (req.body)
  //console.log(req.body)
  let user_id = generateRandomString()
  //console.log(userID)
  console.log("before", users)
  if ((req.body.email === "") || (req.body.password === "")) {
    return res.status(404)
  }

  if (findUserByEmail(loginInfo.email)) {
    res.redirect('/login_form')

  } else {
    users[user_id] = {
      id: user_id,
      email: req.body.email,
      password: req.body.password
    }
    console.log("after", users)
    //user_id : req.cookies["user_id"]
    res.cookie("user_id", user_id)
    res.redirect('/urls')
  }
})

// diplaying login_form
app.get('/login_form', (req, res) => {
  console.log(req.cookies)
  let userID = req.cookies['user_id']
  const tempname = {
    username: userID
  }


  res.render('login_form', tempname)

})

app.post('/login', (req, res) => {
  // extract email and password
  const email = req.body.email
  const password = req.body.password
  console.log(email, password)

  //find the user object that email
  const userFound = findUserByEmail(email)

  // if user found in db, then compare the password

  if (userFound && userFound.password === password) {
    //if they match , log the user in
    console.log("hello", userFound)
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
    
    //console.log(url)


    // if(urlDatabase1[shortURL][userID] === matchID){
    //   matchID[shortURL] = urlDatabase1[shortURL]
    // }

  }
  return id;
}
