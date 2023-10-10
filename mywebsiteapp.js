const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const connectSqlite3 = require('connect-sqlite3')


// defines the port
const port = 8080
// creates the Express app 
const app = express();

// defines handlebars engine
app.engine('handlebars', engine());
// defines the view engine to be handlebars
app.set('view engine', 'handlebars');
// defines the views directory
app.set('views', './views');

// define static directory "public"
app.use(express.static('public'))

// defines a middleware to log all the incoming requests' URL
app.use((req, res, next) => {
    console.log("Req. URL: ", req.url)
    next()
})

// app.get('/', (req, res) => {
//     const model={
//         isLoggedIn: req.session.isLoggedIn,
//         name: req.session.name,
//         isAdmin: req.session.isAdmin
//       }
//       res.render('home.handlebars', model)
// })

//------------
// POST Forms
//------------
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//---------
// SESSION
//---------

const SQLiteStore = connectSqlite3(session);

app.use(session({
  store: new SQLiteStore({db: "session-db.db"}),
  "saveUninitialized": false,
  "resave": false,
  "secret": "This123Is@Another#456GreatSecret678%Sentence"
}));

//-------------------------------
//  DATABASE CREATION
//-------------------------------

const db = new sqlite3.Database('portfolio-ca3.db')
db.run("CREATE TABLE User (user_id INTEGER PRIMARY KEY, user_name TEXT NOT NULL, pass_word TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL)", (error) => {
	if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table projects created!")
  
      const user=[
        { "id":"1", "username":"cameron_alex", "password":"12345", "fname": "Cameron", "lname": "Alexander"},
        { "id":"2", "username":"jerome_l", "password":"12345", "fname": "Jerome", "lname": "Landre"}
      ]
      // inserts users
      user.forEach( (oneUser) => {
        db.run("INSERT INTO User (user_id, user_name, pass_word, first_name, last_name) VALUES (?, ?, ?, ?, ?)", [oneUser.id, oneUser.username, oneUser.password, oneUser.fname, oneUser.lname], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the Users table!")
          }
        })
      })
    }
  })

db.run("CREATE TABLE Blogs(blogs_id INTEGER PRIMARY KEY, user_id INTEGER, blog_title TEXT, blog_image TEXT, blog_desc TEXT, blog_date TEXT, FOREIGN KEY (user_id) REFERENCES User (user_id))", (error) => {
	if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table blogs created!")
  
      const blogs=[
        { "id":"1", "userid":"1", "title":"Sweden", "image": "", "desc": "Currently I am in Sweden enjoying an exchange year!!! Meeting loads of new friends!", "date": "19/08/2023"},
        { "id":"2", "userid":"1", "title":"Second Year Uni", "image": "", "desc": "I have just completed my second year of University, now onto the last year! or hopefully a year in sweden :)", "date": "02/06/2023"}
      ]
      // inserts blogs
      blogs.forEach( (oneBlogs) => {
        db.run("INSERT INTO Blogs (blogs_id, user_id, blog_title, blog_image, blog_desc, blog_date) VALUES (?, ?, ?, ?, ?, ?)", [oneBlogs.id, oneBlogs.user, oneBlogs.title, oneBlogs.image, oneBlogs.desc, oneBlogs.date], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the Blogs table!")
          }
        })
      })
    }
  })


//-------------------------------
//  LOG IN APP
//-------------------------------
app.get('/login', (req, res) => {
    const model={
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
    }
    res.render('login.handlebars', model)
  });
  
  app.post('/login', (req, res) => {
    const un = req.body.un
    const pw = req.body.pw
  
    console.log("LOGIN: ", un)
    console.log("PASSWORD: ", pw)
  
    if (un=="cameron" && pw=="1234") {
      console.log("Cameron is logged in!")
      req.session.isAdmin = true
      req.session.isLoggedIn = true
      req.session.name = "Cameron"
      res.redirect('/')
    } else {
      console.log('Bad user and/or bad password')
      req.session.isAdmin = false
      req.session.isLoggedIn = false
      req.session.name = ""
      res.redirect('/login')
    }
  })
  
  // ------------
  // LOG OUT
  // ------------
  
  app.get('/logout', (req, res) => {
    req.session.destroy( (err) => {
      console.log("Error while destroying the session: ", err)
    })
    console.log('Logged out...')
    res.redirect('/')
  })

// renders a view WITHOUT DATA
app.get('/', (req, res) => {
    console.log("SESSION: ", req.session)
    const model={
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('home.handlebars', model)
  })


app.get('/blogs', (req, res) => {
    const model={
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
    res.render('blogs.handlebars', model)
})

app.get('/contact', (req, res) => {
    const model={
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
    res.render('contact.handlebars', model)
})

// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});
