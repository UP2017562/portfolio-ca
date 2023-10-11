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

db.run("CREATE TABLE user (user_id INTEGER PRIMARY KEY, user_name TEXT NOT NULL, pass_word TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL)", (error) => {
	if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table users created!")
  
      const user=[
        { "id":"1", "username":"cameron_alex", "password":"12345", "fname": "Cameron", "lname": "Alexander"},
        { "id":"2", "username":"jerome_l", "password":"12345", "fname": "Jerome", "lname": "Landre"}
      ]
      // inserts users
      user.forEach( (oneUser) => {
        db.run("INSERT INTO user (user_id, user_name, pass_word, first_name, last_name) VALUES (?, ?, ?, ?, ?)", [oneUser.id, oneUser.username, oneUser.password, oneUser.fname, oneUser.lname], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the Users table!")
          }
        })
      })
    }
  })

db.run("CREATE TABLE blogs (blogs_id INTEGER PRIMARY KEY, blogs_uid INTEGER, blog_title TEXT, blog_image TEXT, blog_desc TEXT, blog_date TEXT, FOREIGN KEY (blogs_uid) REFERENCES user (user_id))", (error) => {
	if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table blogs created!")
  
      const blogs=[
        { "id":"1", "uid":"1", "title":"Sweden", "image": "/img/Sweden.jpeg", "desc": "Currently I am in Sweden enjoying an exchange year!!! Meeting loads of new friends!", "date": "19/08/2023"},
        { "id":"2", "uid":"1", "title":"Second Year Uni", "image": "/img/Portsmouth.jpeg", "desc": "I have just completed my second year of University, now onto the last year! or hopefully a year in sweden :)", "date": "02/06/2023"},
        { "id":"3", "uid":"1", "title":"Completing Project", "image": "/img/Coding.jpeg", "desc": "Me and our team has completed our group project, was not fully done but everything is now completed", "date": "30/05/2023"}
      ]
      // inserts blogs
      blogs.forEach( (oneBlogs) => {
        db.run("INSERT INTO blogs (blogs_id, blogs_uid, blog_title, blog_image, blog_desc, blog_date) VALUES (?, ?, ?, ?, ?, ?)", [oneBlogs.id, oneBlogs.uid, oneBlogs.title, oneBlogs.image, oneBlogs.desc, oneBlogs.date], (error) => {
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
//  BLOGS
//-------------------------------

// defines route "/blogs"
app.get('/blogs', function(req,res){
  db.all("SELECT * FROM blogs", function (error, theBlogs){
    if (error) {
      const model = {
        style: "blogs.css",
        hasDatabaseError: true,
        theError: error,
        blogs: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("blogs.handlebars", model)
    }
    else {
      const model = {
        style: "blogs.css",
        hasDatabaseError: false,
        theError: "",
        blogs: theBlogs,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("blogs.handlebars", model)
    }
  })
})

//--------------------
// CREATES NEW BLOG
//--------------------

// SENDS THE FORM FOR A NEW PROJECT
app.get('/blogs/new', (req, res) => {
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    const model = {
      style: "blogs.css",
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render("newblogs.handlebars", model)
  } else {
    res.redirect('/login')
  }
})

// CREATES NEW PROJECT
app.post('/blogs/new', (req, res) => {
  const newp = [
    req.body.blogtitle, req.body.blogdate, req.body.blogdesc, req.body.bloguser, req.body.blogimg,
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("INSERT INTO blogs (blog_title, blog_date, blog_desc, blogs_uid, blog_image) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the Blogs table!")
      }
      res.redirect('/blogs')
    })
  } else {
    res.redirect('/login')
  }
})

//-----------------
// MODIFY A BLOG
//-----------------

//SENDS TEH FORM TO MODIFY A PROJECT
app.get('/blogs/update/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM projects WHERE pid=?", [id], function (error, theProject) {
    if (error) {
      console.log("ERROR: ", error)
      const model = { dbError: true, theError: error,
        project: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("modifyproject.handlebars", model)
    } else {
      const model = { dbError: false, theError: "",
        project: theProject,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        helpers: {
          theTypeR(value) { return value == "Research"; },
          theTypeT(value) { return value == "Teaching"; },
          theTypeO(value) { return value == "Other"; },
        }
      }
      res.render("modifyproject.handlebars", model)
    }
  })
})

app.post('/projects/update/:id', (req, res) => {
  const id = req.params.id // gets the id from the dynamic parameter in the route
  const newp = [
    req.body.projname, req.body.projyear, req.body.projdesc, req.body.projtype, req.body.projimg, id
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("UPDATE projects SET pname=?, pyear=?, pdesc=?, ptype=?, pimgURL=? WHERE pid=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Project Updated!")
      }
      res.redirect('/projects')
    })
  } else {
    res.redirect('/login')
  }
})

//------------------
// DELETES A PROJECT
//------------------

app.get('/projects/delete/:id', (req, res) => {
  const id = req.params.id
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("DELETE FROM projects WHERE pid=?", [id], function (error, theProjects){
      if (error) {
        const model = { dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render("home.handlebars", model)
      } else {
        const model = { dbError: false, theError: "",
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
      }
      res.render("home.handlebars", model)
      } 
    })
  } else{
    res.redirect('/login')
  }
})


//-------------------------------
//  LOG IN APP
//-------------------------------

app.get('/login', (req, res) => {
    const model={
      style: "login.css",
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
      style: "home.css",
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin
    }
    res.render('home.handlebars', model)
  })

app.get('/contact', (req, res) => {
    const model={
      style: "contact.css",
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
