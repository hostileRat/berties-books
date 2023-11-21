module.exports = function (app, shopData) {
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });
  app.get("/search-result", function (req, res) {
    //searching in the database
    let sqlquery = `SELECT * FROM books WHERE name = '${req.query.keyword}'`;
    // Execute query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      }
      let searchResult = Object.assign({}, shopData, {
        availableBooks: result,
        heading: "Search Results",
      });
      // console.log(searchResult);
      res.render("list.ejs", searchResult);
      // console.log(searchResult.availableBooks[0].name);
    });
  });
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });
  app.post("/registered", function (req, res) {
    // saving data in database
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });
  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      }
      let searchResult = Object.assign({}, shopData, {
        availableBooks: result,
        heading: "Here are the books that we sell",
      });
      // console.log(searchResult);
      res.render("list.ejs", searchResult);
      // console.log(searchResult.availableBooks[0].name);
    });
  });

  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  app.post("/bookadded", function (req, res) {
    if (typeof req.body.price != Number || typeof req.body.name != String) {
      res.redirect("/addbook");
    }

    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This book is added to database, name: " +
            req.body.name +
            " price " +
            req.body.price
        );
      }
    });
  });

  app.get("/bargainbooks", function (req, res) {
    let sqlquery = "SELECT * FROM books WHERE price < 20;";

    db.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      }
      let searchResult = Object.assign({}, shopData, {
        availableBooks: result,
        heading: "Here are the books that we sell under £20",
      });
      // console.log(searchResult);
      res.render("list.ejs", searchResult);
      // console.log(searchResult.availableBooks[0].name);
    });
  });
};
