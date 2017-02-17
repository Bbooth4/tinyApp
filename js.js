// app.get(`/urls/:id`, (req, res) => {
//   let userId = req.session.email;
//   console.log(user[userId])
//   if (!userId) {
//     res.status(401).send("You must be logged in to view and create a tiny URL!");
//     // if user is not logged in:
//   } else if (userId !== user[userId].email) {
//     res.status(403).send("You do not have the necessary permissions to access this link. Login with this <a href='http://localhost:8080/login'>link</a> to access your own tiny url links.");
//     // if logged in user does not match the user that owns this url:
//   } else if (!user[userId].urlDatabase[req.params.id]) {
//     res.status(404).send("That URL does not exist!");
//     // if url w/ :id does not exist:
//   } else {
//     let templateVars = {
//       email: userId,
//       shortURL: req.params.id,
//       longURL: user[userId].urlDatabase[req.params.id],
//       urls: user[userId].urlDatabase  };
//     res.status(200).render("urls_show", templateVars);
//   }
// });

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

app.get(`/urls/:id`, (req, res) => {
  let userId = req.session.email;
  console.log(user[userId]);
  if (userId) {
    // if the url has an owner, return true
    if (findURLByKey()) {
      if (req.params.id in user[userId].urlDatabase) {
        let templateVars = {
          email: userId,
          shortURL: req.params.id,
          longURL: user[userId].urlDatabase[req.params.id],
          urls: user[userId].urlDatabase  
        };
        return res.status(200).render("urls_show", templateVars);
      }
      return res.status(404).send("That URL does not exist!");
        // if url w/ :id does not exist:
     } else {
        res.status(403).send("You do not have the necessary permissions to access this link. Login with this <a href='http://localhost:8080/login'>link</a> to access your own tiny url links.");
        // if logged in user does not match the user that owns this url:
     }
  } else {
    res.status(401).send("You must be logged in to view and create a tiny URL!");
    // if user is not logged in:
  }
});

function findURLByKey() {
  let userId = req.session.email;
  for (let key in user) {
    for (let users in user[key].urlDatabase) {
      if (users === userId) {
        return userId;
      }
    }
  }
  return -1; 
}