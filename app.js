const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(morgan('dev'));
app.set(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
  // "booth.brandon4@gmail.com": {
  //   id: "b2xVn2",
  //   email: "booth.brandon4@gmail.com",
  //   password: "b",
  //   urlDatabase: {
  //     "b2xVn2": "http://www.google.com"
  //   }
  // }
};

// ---------------------------- GETS -------------------------- //

app.get("/", (req, res) => {
  let userId = req.session.email;
  if (userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let userId = req.session.email;
  if (!userId) {
    res.status(403).send("You must be logged in to view and create tiny URL!");
  } else {
    let templateVars = {
      email: userId,
      urls: user[userId].urlDatabase };
    res.render("urls_index", templateVars);
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
    res.render("urls_new", templateVars);
  }
});

app.get("/register", (req, res) => {
  let userId = req.session.email;
  let templateVars = {
    email: userId
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  let userId = req.session.email;
  let templateVars = {
    email: userId
  };
  res.render("urls_login", templateVars);
});

app.get(`/urls/:id`, (req, res) => {
  let userId = req.session.email;
  if (!userId) {
    res.status(403).send("You must be logged in to view and create tiny URL!");
  } else {
    let templateVars = {
      email: userId,
      shortURL: req.params.id,
      longURL: user[userId].urlDatabase[req.params.id],
      urls: user[userId].urlDatabase  };
    res.render("urls_show", templateVars);
  }
});


// -------------------------- POSTS -------------------------- //

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
})

app.post("/urls", (req, res) => {
  const randomURLString = generateRandomString();
  let userId = req.session.email;
  user[userId].urlDatabase[randomURLString] = req.body.longURL;
  res.redirect(`urls/${randomURLString}`);
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
    res.redirect(`/urls`);
  } else {
    res.status(403).send("That user already exists!");
  }
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let hashedPassword = user[email].password;
  let saltRounds = 10;
  if (user[req.body.email] && bcrypt.compareSync(req.body.password, hashedPassword)) {
    req.session.email = email;
    res.redirect(`/urls`);
  } else {
    res.status(403).send("Incorrect login credentials!");
  }
});

app.post("/urls/:id/update", (req, res) => {
  let userId = req.session.email;
  user[userId].urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/urls/:id/delete", (req, res) => {
  let userId = req.session.email;
  delete user[userId].urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.post("/urls/new", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});