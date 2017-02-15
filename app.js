const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
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
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// ---------------------------- GETS -------------------------- //

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let user = req.session.email;
  let templateVars = {
    email: req.session.email,
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let user = req.session.email;
  let templateVars = {
    email: req.session.email,
    shortURL: user,
    longURL: urlDatabase[user] };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    email: req.session.email,
    shortURL: req.session.email,
    longURL: urlDatabase[req.session.email] };
  res.render("urls_register", templateVars);
});

app.get(`/urls/:id`, (req, res) => {
  let user = req.session.email;
  let templateVars = {
    email: req.session.email,
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


// -------------------------- POSTS -------------------------- //

app.post("/logout", (req, res) => {
  req.session.email = null;
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  const randomURLString = generateRandomString();
  let user = req.session.email;
  urlDatabase[randomURLString] = req.body.longURL;
  res.redirect(`urls/${randomURLString}`);
});

app.post("/register", (req, res) => {
  const randomURLString = generateRandomString();
  let email = req.body.email;
   // sets the cookie
  req.session.email = email;
  // urlDatabase[randomURLString] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  // urlDatabase[randomURLString] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});

app.post("/urls/new", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});