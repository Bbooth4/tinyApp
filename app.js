const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set(bodyParser.json());
app.use(morgan('dev'));
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
  let templateVars = {
    urls: urlDatabase };
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_register", templateVars);
});

app.get(`/urls/:id`, (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


// -------------------------- POSTS -------------------------- //

app.post("/urls", (req, res) => {
  const randomURLString = generateRandomString();
  urlDatabase[randomURLString] = req.body.longURL;
  res.redirect(`urls/${randomURLString}`);
});

app.post("/register", (req, res) => {
  const randomURLString = generateRandomString();
  // req.session.email
  urlDatabase[randomURLString] = req.session.email;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  lurlDatabase[req.params.id] = req.body.longURL;
  urlDatabase[randomURLString] = req.body.longURL;
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