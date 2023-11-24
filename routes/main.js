// Exporting a function that takes in the Express app and shopData as parameters
module.exports = function (app, shopData) {
  // Handle the root route
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });

  // Handle the about route
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  // Handle the search route
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });

  // Handle the search result route
  app.get("/search-result", function (req, res) {
    // Construct the SQL query to search for books based on the keyword
    let sqlquery = `SELECT * FROM books WHERE LOWER(name) LIKE LOWER('%${req.query.keyword}%')`;

    // Execute the SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      }

      // Create a new object by merging shopData and the search result
      let searchResult = Object.assign({}, shopData, {
        availableBooks: result,
        heading: "Search Results",
      });

      // Render the list.ejs template with the search result
      res.render("list.ejs", searchResult);
    });
  });

  // Handle the register route
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  // Handle the registered route
  app.post("/registered", function (req, res) {
    // Save the registration data in the database
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });

  // Handle the list route
  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // Query the database to get all the books

    // Execute the SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      }

      // Create a new object by merging shopData and the list of books
      let searchResult = Object.assign({}, shopData, {
        availableBooks: result,
        heading: "Here are the books that we sell",
      });

      // Render the list.ejs template with the list of books
      res.render("list.ejs", searchResult);
    });
  });

  // Handle the addbook route
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  // Handle the bookadded route
  app.post("/bookadded", function (req, res) {
    // Save the book data in the database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";

    // Execute the SQL query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This book is added to the database, name: " +
            req.body.name +
            " price " +
            req.body.price
        );
      }
    });
  });

  // Handle the bargainbooks route
  app.get("/bargainbooks", function (req, res) {
    let sqlquery = "SELECT * FROM books WHERE price < 20;";

    // Execute the SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("./");
      }

      // Create a new object by merging shopData and the list of bargain books
      let searchResult = Object.assign({}, shopData, {
        availableBooks: result,
        heading: "Here are the books that we sell under £20",
      });

      // Render the list.ejs template with the list of bargain books
      res.render("list.ejs", searchResult);
    });
  });
};
