const express = require("express");
//const { generateRandomString, urlsForUser, findUserByEmail } = require('./helpers.js')
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
  res.redirect("/register");
});

// Displays urlDatabase
app.get("/urls.json", (req, res) => {
 res.json(urlDatabase1);
});

app.get("/hello", (req, res) => {
  res.send("<html><body><b> Welcome to TinyApp </b></body></html>\n");
  res.redirect("/urls");
});

l
app.get("/urls", (req, res) => {
  //console.log("hi",req.sessions["user_id"])
  console.log("in urls get route")
  const id = req.session.user_id;
  console.log("user_id id", id)
  if (!id) {
    console.log("reg session ['user_id']", req.session['user_id']);
    res.redirect('/login_form');
  } else {
    const urlsName = urlsForUser(id, urlDatabase1);
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
  console.log("app.get(/urls/new")
  if (!req.session['user_id']) {

    res.redirect('/login_form');
  } else {
    const user_id = req.session['user_id'];
    console.log("user_id", user_id)
    const templateVars = {
      username: users[user_id]
    };
    //new code allowing users to access the urls/new page
    res.render("urls_new", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  //console.log("/u/:shortURL")
  //console.log("user_id",user_id)
  console.log("received request")
  const shortURL = req.params.shortURL;
  console.log("shortURL for this one :", shortURL)
  let longURL = urlDatabase1[req.params.shortURL]['longURL'];
  if(!longURL) { // this extra comments
    res.redirect(403).send("Please create long url") //this is extra comment
  } else{
    
    res.redirect(longURL); // keep this comments
   } //else {
  //   res.redirect(403).send("Please create long url")
  // }

});
// route to edit
app.get("/urls/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;
  console.log(shortURL)
  console.log("edit")
  console.log("tinyapp")
  const id = req.session['user_id'];
  console.log("id in/urls/shortURL ", id)
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase1[shortURL]['longURL'],
    username: users[req.session['user_id']]
  };

  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log("this is post", req.body.longURL);  // Log the POST request body to the console
  const urlName = generateRandomString();
  console.log("urlName ", urlName)
  console.log("urlDatabase1[urlName]", urlDatabase1[urlName])
  //urlDatabase1[urlName] = req.body.longURL;
  urlDatabase1[urlName] = { longURL: req.body.longURL, userID: req.session['user_id'] };
  //urlDatabase1[urlName].longURL = req.body.longURL;
  console.log("display longurl", urlDatabase1[urlName]['longURL'])
  res.redirect('/urls');         
});


// new code added for delete
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(req.params)
  // extract the id from the path :req.params.shortUrl
  const id = req.params.shortURL;
  // delete the entry for that id in database
  delete urlDatabase1[id];
  //redirect to tinyap
  res.redirect('/urls');
});

//route to update the database with new url
app.post('/urls/:id', (req, res) => {

  console.log(req.params.shortURL)
  const shortURL = req.params.id;
  console.log(req.body)
  const userID = req.session['user_id'];
  const urlBelongsToUser = urlDatabase1[shortURL] && urlDatabase1[shortURL].userID === userID;
  if (urlBelongsToUser) {
    urlDatabase1[shortURL]['longURL'] = req.body.Url;
    console.log("urlDatabase1[id]", urlDatabase1[shortURL]['longURL'])
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session['user_id']]
    }
    res.render('errorPage', templateVars);
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
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  const loginInfo = (req.body)
  const password = req.body.password
  const email = req.body.email
  //console.log(req.body)
  let user_id = generateRandomString();
  //console.log(userID)
  console.log("before", users)
  if ((email.length === 0) || (password.length === 0)) {
    return res.status(400).send("Email or Password is not valid");
  } else if (findUserByEmail(email)) {
    return res.status(400).send("Email is already in use, please Login");


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
});

// diplaying login_form
app.get('/login_form', (req, res) => {
  //console.log(req.cookies)
  let userID = req.session['user_id'];
  const tempname = {
    username: userID
  }


  res.render('login_form', tempname);

})

app.post('/login', (req, res) => {
  // extract email and password
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password)

  //find the user object that email
  const userFound = findUserByEmail(email);
  console.log("userFound in / login route ", userFound)
  // if user found in db, then compare the password
  console.log("userfound", userFound)

  if (!userFound){
    console.log("userfound",userFound)
    res.status(403).send("Email not found, please Register")
   } if(!bcrypt.compareSync(password, userFound.password)){
    res.status(403).send("Invalid password"); 
    
    } else {
      req.session['user_id'] = userFound.id;
      res.redirect('/urls');
    
    }
   
  ////  start from here

  //______________________________________________________________________
  ////this is actual code..
  // if (userFound && bcrypt.compareSync(password, userFound.password)) {
  //   console.log(bcrypt.compareSync(password, userFound.password))
  //   ////if they match , log the user in
  //   console.log("hello", userFound)
  //   req.session['user_id'] = userFound.id;
  //   ////req.session('user_id', userFound.id)
  //   res.redirect('/urls');
  //   //// res cookie

  //   //// else show error message
  // } else {
  //   res.status(403).send("Email not found ")
  //   ////alert.()
  //   res.redirect('/register');
  // }
//___________________________________________________________________________________
})
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
  let id = {};
  for (url in urlDatabase1){
    if(urlDatabase1[url].userID === matchID){
      id[url] = urlDatabase1[url];
    }

    // console.log("this is coming from urlsForUser function url",url)
    // console.log("this is coming from urlsForUser function id ",id)

    // if(urlDatabase1[shortURL][userID] === matchID){
    //   matchID[shortURL] = urlDatabase1[shortURL];
    // }

  }
  return id;
}


// const findUserByEmail = (email) => {
//   for (let userID in users) {
//     if (users[userID]["email"] === email) {
//       return users[userID];

//     }
//   }
//   return false;

// }