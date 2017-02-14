const express = require("express");
const app = express();
const body = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(morgan('dev'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// -------------------------- GETS ---------------------------- //

app.get("/", (req, res) => {
  let templateVars = {
    urls: urlDatabase };
  // res.end("Hello!");
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});