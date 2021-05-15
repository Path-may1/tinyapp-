const express = require("express");

// creating an Express app
const app = express();

const PORT = 8080; // default port 8080

//setting ejs as template engine
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser')
app.use(cookieParser());

//bcrypt
const bcrypt = require('bcrypt');

//require cookie session
cookieSession = require('cookie-session') 
//req.session.user_id = "some value";
// cookie session Middleware
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// datebase => shortUrl and longUrl
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
//   "4mp89x": "http://amazon.ca"
// };
// const urlsForUser = function(user_id) {
//   urlsObj = {};
//   const name = Object.keys(urlDatabase1)
//   for(name of urlDatabase1){
//    if(urlDatabase1[name].userID ===  user_id){
    
//     urlsObj[name]= {
//       longURL : urlDatabase1[name].longURL,
//       userID : user_id
//     }
//   }
//     } 
//    return urlsObj

//   }







const urlDatabase1 = {
  b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};
// global object user database
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
  ////console.log("logging res.cookies",req.cookies)
  //***** */ if the userid is present{
  //***res.redirect('/urls')
  // }else {
  res.redirect('/login_form')
  //
  //res.send("Hello!");
});



app.get("/urls.json", (req, res) => {
 console.log("urldatabase",urlDatabase1)
  res.json(urlDatabase1);
});
app.get("/users.json", (req, res) => {
  res.json(users);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  //console.log("hi",req.sessions["user_id"])
  console.log("in urls get route")
  const id = req.session.user_id
 console.log("user_id id",id)
  if(!id) {
    console.log("reg session ['user_id']",req.session['user_id'])
    res.redirect('/login_form')
  }else{
    const urlsName = urlsForUser(id, urlDatabase1)
    console.log("urlsName", urlsName)
  const templateVars = {
    urls: urlsName,   //urlsForUser(id,urlDatabase1),
    username: users[id]
  };
console.log(templateVars['urls'])

  res.render("urls_index", templateVars);
  }
});



// Create new urls page 
app.get("/urls/new", (req, res) => {
  if (!req.session['user_id']) {

    res.redirect('/login_form')
  } else {
    const user_id = req.session['user_id']
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
  console.log("shortURL for this one",shortURL)
  const longURL = urlDatabase1[shortURL]['longURL']
  console.log("longURL",longURL)
  res.redirect('longURL');
});
// route to edit
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL)
  console.log("edit")
  console.log("tinyapp")
  const id = req.session['user_id']
  console.log("reg session.user",req.session['user_id'])
  
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase1[shortURL]['longURL'],
    //username: req.session["username"]
    username : req.session['user_id']
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log("this is post",req.body.longURL);  // Log the POST request body to the console
  const urlName = generateRandomString();
 console.log("urlName ", urlName)
 console.log("urlDatabase1[urlName]",urlDatabase1[urlName])
  //urlDatabase1[urlName] = req.body.longURL;
  urlDatabase1[urlName] = {longURL:req.body.longURL, userID : req.session['user_id']} 
  //urlDatabase1[urlName].longURL = req.body.longURL;
  console.log("display longurl",urlDatabase1[urlName]['longURL'])
  res.redirect('/urls');         // Respond with 'Ok' (we will replace this)
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
app.post('/urls/:id', (req, res) => {
  
  console.log(req.params.shortURL)
  const shortURL = req.params.id
  console.log(req.body)
  const  userID = req.session['user_id']
  const urlBelongsToUser = urlDatabase1[shortURL] && urlDatabase1[shortURL].userID === userID
if( urlBelongsToUser){
  urlDatabase1[shortURL]['longURL'] = req.body.Url
  console.log("urlDatabase1[id]",urlDatabase1[shortURL]['longURL'])
  res.redirect('/urls')
} else{
  const  templateVars = {
    user: users[req.session['user_id']]
  }
  res.render('errorPage',templateVars)
}

  
})


// Logout route
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const templateVars = {
    urls: urlDatabase1,
    username: req.session["user_id"]
  };
  res.render('register', templateVars)
});

app.post('/register', (req, res) => {
  const loginInfo = (req.body)
  const password = req.body.password
 const email = req.body.email
  //console.log(req.body)
  let user_id = generateRandomString()
  //console.log(userID)
  console.log("before", users)
  if ((email.length === 0) || (password.length === 0)) {
    return res.status(400).send("Email or Password is not valid")
  } else if (findUserByEmail(email)) {
      return res.status(400).send("Email is already in use")
    
  } else {
    users[user_id] = {
      id: user_id,
      email: req.body.email,
      password: bcrypt.hashSync(password, 10)
    }
    console.log("after", users)
    //user_id : req.cookies["user_id"]
    req.session['user_id'] = user_id
    res.redirect('/urls')
  }
})

// diplaying login_form
app.get('/login_form', (req, res) => {
  //console.log(req.cookies)
  let userID = req.session['user_id']
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
  console.log("userfound", userFound)
   // if (userFound && userFound.password === password) {
  console.log(bcrypt.compareSync(password, userFound.password))
   if(userFound && bcrypt.compareSync(password, userFound.password)){
   //if they match , log the user in
    console.log("hello", userFound)
   req.session['user_id'] =  userFound.id
    //req.session('user_id', userFound.id)
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

