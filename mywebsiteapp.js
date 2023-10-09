const express = require('express');
const { engine } = require('express-handlebars');

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
