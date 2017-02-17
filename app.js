const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(morgan('dev'));
app.set(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

function generateRandomString() {
  const seedString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  while (randomString.length !== 6) {
    let randomCharacterIndex = Math.floor(Math.random() * seedString.length);
    randomString += seedString[randomCharacterIndex];
  }
  return randomString;
};

let user = {
 "booth.brandon4@gmail.com": {
    id: "b2xVn2",
    email: "booth.brandon4@gmail.com",
    password: bcrypt.hashSync("b", 10),
    urlDatabase: {
     "b2xVn3": "http://www.google.com"
   }
  }
};

// ---------------------------- GETS -------------------------- //

app.get("/", (req, res) => {
  let userId = req.session.email;
  if (userId) {
    res.status(200).redirect("/urls");
  } else {
    res.status(200).redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let userId = req.session.email;
  if (!userId) {
    res.status(403).send("You must be logged in to view and create tiny URLs!");
  } else {
    let templateVars = {
      email: userId,
      urls: user[userId].urlDatabase };
    res.status(200).render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  let userId = req.session.email;
  if (!userId) {
    res.status(403).send("You must be logged in to view and create tiny URL!");
  } else {
    let templateVars = {
      email: userId,
      shortURL: userId,
      longURL: req.body.longURL,
      urls: user[userId].urlDatabase  };
    res.status(200).render("urls_new", templateVars);
  }
});

app.get("/register", (req, res) => {
  let userId = req.session.email;
  let templateVars = {
    email: userId
  };
  res.status(200).render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let userId = req.session.email;
  let templateVars = {
    email: userId
  };
  res.status(200).render("urls_login", templateVars);
});

app.get(`/urls/:id`, (req, res) => {
  let userId = req.session.email;
  console.log(user[userId])
  if (userId) {
    if (userId in user) {
      if (req.params.id in user[userId].urlDatabase) {
        let templateVars = {
          email: userId,
          shortURL: req.params.id,
          longURL: user[userId].urlDatabase[req.params.id],
          urls: user[userId].urlDatabase  };
        res.status(200).render("urls_show", templateVars);
        } else {
          res.status(404).send("That URL does not exist!");
          // if url w/ :id does not exist:
        }
     } else {
        res.status(403).send("You do not have the necessary permissions to access this link. Login with this <a href='http://localhost:8080/login'>link</a> to access your own tiny url links.");
        // if logged in user does not match the user that owns this url:
     }
  } else {
    res.status(401).send("You must be logged in to view and create a tiny URL!");
    // if user is not logged in:
  }
});

app.get("/u/:id", (req, res) => {
  let located = false;
  let email;
  let webAdress;
  for (email in user) {
    for (longURL in user[email].urlDatabase) {
      if(req.params.id === longURL) {
        webAdress = user[email].urlDatabase[longURL];
        located = true;
      }
    }
  }
  if (located === false) {
    res.status(404).send('That url does not exist!');
  } else {
    res.status(200).redirect(webAdress);
  }
})


// -------------------------- POSTS -------------------------- //

app.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).redirect("/login");
})

app.post("/urls", (req, res) => {
  const randomURLString = generateRandomString();
  let userId = req.session.email;
  user[userId].urlDatabase[randomURLString] = req.body.longURL;
  res.status(200).redirect(`urls/${randomURLString}`);
});

app.post("/register", (req, res) => {
  const randomURLString = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  let saltRounds = 10;
  let hashedPassword = bcrypt.hashSync(password, saltRounds);
  if (req.body.password === "") {
    res.status(403).send("You failed to provide an adequate password with at least one character.");
  } else if (!user[req.body.email]) {
    req.session.email = email;
    user[req.body.email] = {
      id: randomURLString,
      email: req.body.email,
      password: hashedPassword,
      urlDatabase: {}
      }
    res.status(200).redirect(`/`);
  } else {
    res.status(403).send("That user already exists!");
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  if (user[email] && bcrypt.compareSync(req.body.password, user[email].password)) {
    req.session.email = email;
    res.status(200).redirect(`/`);
  } else {
    res.status(403).send("Incorrect login credentials!");
  }
});

app.post("/urls/:id/update", (req, res) => {
  let userId = req.session.email;
  user[userId].urlDatabase[req.params.id] = req.body.longURL;
  res.status(200).redirect(`/urls`);
});

app.post("/urls/:id/delete", (req, res) => {
  let userId = req.session.email;
  delete user[userId].urlDatabase[req.params.id];
  res.status(200).redirect(`/urls`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});