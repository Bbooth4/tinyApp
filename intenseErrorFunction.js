app.get(`/urls/:id`, (req, res) => {
  let userId = req.session.email;
  function findURLByKey() {
    for (let key in user) {
      for (let users in user[key].urlDatabase) {
        if (users === userId) {
          return userId;
        }
      }
    }
    return -1; 
  }
  let result = findURLByKey(); 
  if (userId) {
    // if the url has an owner, return true
    if (result === -1) {
      // if (req.params.id in user[userId].urlDatabase) {
      return res.status(404).send("That URL does not exist!");
        // if url w/ :id does not exist:
      if (userId === result) {
        let templateVars = {
          email: userId,
          shortURL: req.params.id,
          longURL: user[userId].urlDatabase[req.params.id],
          urls: user[userId].urlDatabase };
        return res.status(200).render("urls_show", templateVars);
      // }
      } else {
        res.status(403).send("You do not have the necessary permissions to access this link. Login with this <a href='http://localhost:8080/login'>link</a> to access your own tiny url links.");
        // if logged in user does not match the user that owns this url:
      }
    } else {
      res.status(401).send("You must be logged in to view and create a tiny URL!");
      // if user is not logged in:
    }
  }
});

// function findURLByKey() {
//   let userId = req.session.email;
//   for (let key in user) {
//     for (let users in user[key].urlDatabase) {
//       if (users === userId) {
//         return userId;
//       }
//     }
//   }
//   return -1; 
// }