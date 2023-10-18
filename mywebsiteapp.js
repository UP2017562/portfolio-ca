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

db.run("CREATE TABLE cv (cv_id INTEGER PRIMARY KEY, cv_title TEXT, cv_image TEXT, cv_desc TEXT)", (error) => {
  if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table cv created!")
  
      const cv=[
        { "id":"1", "title":"Information", "image": "/img/infoicon.png", "desc": "Email: caal23tw@student.ju.se <br>Phone: 0707070707 <br>Address: Kärrhöksgatan 100"},
        { "id":"2", "title":"Education", "image": "/img/eduicon.png", "desc": "2020-2025 - University of Portsmouth <br>2023-2024 - Jonkoping University <br>2018-2020 - Havant South Downs College <br>2013-2018 - Oaklands Catholic School"},
        { "id":"3", "title":"Work Experience", "image": "/img/workicon.png", "desc": "2018 - 1 week: SSE ENERGY <br>2019 - 1 week: SSE ENERGY <br>2019-2023 Morrisons"},
        { "id":"4", "title":"Qualifications", "image": "/img/qualiicon.png", "desc": "Pearson BTEC LEVEL 3 EXTENDED DIP. (WAS NATIONAL DIP. 180+) in IT (SOFTWARE DEVELOPMENT) (QCF) <br>Grade: Distinction* Distinction* Distinction* <br>Pearson (Edexcel GCSE’s) Maths: Grade 4 <br>AQA (General Certificate of Secondary Education GCSE’s) <br>Combined Science (Trilogy): 5-4 <br> English Language: 4<br>Spanish: 4"},
        { "id":"5", "title":"Hobbies", "image": "/img/hobbiesicon.png", "desc": "Swimming, Cycling, Football, Tennis, Attending the gym, Golf, experimenting with emerging technologies."},
      ]
      // inserts blogs
      cv.forEach( (oneCV) => {
        db.run("INSERT INTO cv (cv_id, cv_title, cv_image, cv_desc) VALUES (?, ?, ?, ?)", [oneCV.id, oneCV.title, oneCV.image, oneCV.desc], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the cv table!")
          }
        })
      })
    }
  })

db.run("CREATE TABLE blog (blog_id INTEGER PRIMARY KEY, blog_uid INTEGER, blog_title TEXT, blog_image TEXT, blog_desc TEXT, blog_date TEXT, FOREIGN KEY (blog_uid) REFERENCES user (user_id))", (error) => {
	if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table blog created!")
  
      const blog=[
        { "id":"1", "uid":"1", "title":"Sweden", "image": "/img/Sweden.jpeg", "desc": "Currently I am in Sweden enjoying an exchange year!!! Meeting loads of new friends!", "date": "19/08/2023"},
        { "id":"2", "uid":"1", "title":"Second Year Uni", "image": "/img/Portsmouth.jpeg", "desc": "I have just completed my second year of University, now onto the last year! or hopefully a year in sweden :)", "date": "02/06/2023"},
        { "id":"3", "uid":"1", "title":"Completing Project", "image": "/img/Coding.jpeg", "desc": "Me and our team has completed our group project, was not fully done but everything is now completed", "date": "30/05/2023"}
      ]
      // inserts blogs
      blog.forEach( (oneBlog) => {
        db.run("INSERT INTO blog (blog_id, blog_uid, blog_title, blog_image, blog_desc, blog_date) VALUES (?, ?, ?, ?, ?, ?)", [oneBlog.id, oneBlog.uid, oneBlog.title, oneBlog.image, oneBlog.desc, oneBlog.date], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the Blogs table!")
          }
        })
      })
    }
  })

db.run("CREATE TABLE submit (submit_id INTEGER PRIMARY KEY, submit_name TEXT, submit_email TEXT, submit_desc TEXT)", (error) => {
  if (error) {
      // tests error: display error
      console.log("ERROR: ", error)
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table submit created!")
  
      const submit=[
        { "id":"1", "name":"Steven", "email":"steven.cool@gmail.com", "desc": "Hey, i am interested, can you please contact me when you are free!!"},
        { "id":"2", "name":"Goerge", "email":"george.cool2@gmail.com", "desc": "Hey i wanted to say i love your website and your blogs"}
      ]
      // inserts blogs
      submit.forEach( (oneSubmit) => {
        db.run("INSERT INTO submit (submit_id, submit_name, submit_email, submit_desc) VALUES (?, ?, ?, ?)", [oneSubmit.id, oneSubmit.name, oneSubmit.email, oneSubmit.desc], (error) => {
          if (error) {
            console.log("ERROR: ", error)
          } else {
            console.log("Line added into the submit table!")
          }
        })
      })
    }
  })

//-------------------------------
//  HOME CV
//-------------------------------
// defines route "/home"
app.get('/', function(req,res){
  db.all("SELECT * FROM cv", function (error, theCVs){
    if (error) {
      const model = {
        style: "home.css",
        hasDatabaseError: true,
        theError: error,
        cv: [],
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("home.handlebars", model)
    }
    else {
      const model = {
        style: "home.css",
        hasDatabaseError: false,
        theError: "",
        cv: theCVs,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("home.handlebars", model)
    }
  })
})

//--------------------
// VIEWS A CV
//--------------------

app.get('/home/view/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM cv WHERE cv_id=?", [id], function (error, theCVs) {
    if (error) {
      console.log("ERROR: ", error)
      const model = { 
        dbError: true, 
        theError: error,
        style: "view.css",
        cv: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("viewcv.handlebars", model)
    } else {
      const model = {
        style: "view.css", 
        dbError: false, 
        theError: "",
        cv: theCVs,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("viewcv.handlebars", model)
    }
  })
})

//--------------------
// CREATES NEW CV
//--------------------

// SENDS THE FORM FOR A NEW PROJECT
app.get('/home/new', (req, res) => {
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    const model = {
      style: "new.css",
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render("newcv.handlebars", model)
  } else {
    res.redirect('/login')
  }
})

// CREATES NEW PROJECT
app.post('/home/new', (req, res) => {
  const newp = [
    req.body.cvtitle, req.body.cvimage, req.body.cvdesc,
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("INSERT INTO cv (cv_title, cv_image, cv_desc) VALUES (?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the CV table!")
      }
      res.redirect('/')
    })
  } else {
    res.redirect('/login')
  }
})

//-----------------
// MODIFY A CV
//-----------------

//SENDS TEH FORM TO MODIFY A PROJECT
app.get('/home/update/:id', (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM cv WHERE cv_id=?", [id], function (error, theCVs) {
    if (error) {
      console.log("ERROR: ", error)
      const model = { 
        dbError: true, 
        theError: error,
        style: "blogs.css",
        cv: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("modifyhome.handlebars", model)
    } else {
      const model = {
        style: "blogs.css", 
        dbError: false, 
        theError: "",
        cv: theCVs,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("modifyhome.handlebars", model)
    }
  })
})

app.post('/home/update/:id', (req, res) => {
  const id = req.params.id // gets the id from the dynamic parameter in the route
  const newp = [
    req.body.cvtitle, req.body.cvimage, req.body.cvdesc, id
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("UPDATE cv SET cv_title=?, cv_image=?, cv_desc=? WHERE cv_id=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("CV Updated!")
      }
      res.redirect('/')
    })
  } else {
    res.redirect('/login')
  }
})


//------------------
// DELETES A CV
//------------------

app.get('/home/delete/:id', (req, res) => {
  const id = req.params.id
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("DELETE FROM cv WHERE cv_id=?", [id], function (error, theCVs){
      if (error) {
        const model = { 
          style: "home.css",
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render("home.handlebars", model)
      } else {
        const model = { 
          style: "home.css",
          dbError: false, theError: "",
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
  res.redirect('/')
})

//-------------------------------
//  BLOGS
//-------------------------------

// defines route "/blogs"
app.get('/blogs', function(req,res){
  db.all("SELECT * FROM blog", function (error, theBlogs){
    if (error) {
      const model = {
        style: "blogs.css",
        hasDatabaseError: true,
        theError: error,
        blog: [],
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
        blog: theBlogs,
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
      style: "new.css",
      isLoggedIn: req.session.isLoggedIn,
      name: req.session.name,
      isAdmin: req.session.isAdmin,
    }
    res.render("newblogs.handlebars", model)
  } else {
    res.redirect('/login')
  }
})

// CREATES NEW BLOG
app.post('/blogs/new', (req, res) => {
  const newp = [
    req.body.blogtitle, req.body.blogdate, req.body.blogdesc, req.body.bloguser, req.body.blogimg,
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("INSERT INTO blog (blog_title, blog_date, blog_desc, blog_uid, blog_image) VALUES (?, ?, ?, ?, ?)", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Line added into the Blog table!")
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
  db.get("SELECT * FROM blog WHERE blog_id=?", [id], function (error, theBlogs) {
    if (error) {
      console.log("ERROR: ", error)
      const model = { 
        dbError: true, 
        theError: error,
        style: "new.css",
        blog: {},
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
      }
      res.render("modify.handlebars", model)
    } else {
      const model = {
        style: "new.css", 
        dbError: false, 
        theError: "",
        blog: theBlogs,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
      res.render("modify.handlebars", model)
    }
  })
})

app.post('/blogs/update/:id', (req, res) => {
  const id = req.params.id // gets the id from the dynamic parameter in the route
  const newp = [
    req.body.blogtitle, req.body.blogdate, req.body.blogdesc, req.body.bloguser, req.body.blogimg, id
  ]
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("UPDATE blog SET blog_title=?, blog_date=?, blog_desc=?, blog_uid=?, blog_image=? WHERE blog_id=?", newp, (error) => {
      if (error) {
        console.log("ERROR: ", error)
      } else {
        console.log("Blog Updated!")
      }
      res.redirect('/blogs')
    })
  } else {
    res.redirect('/login')
  }
})

//------------------
// DELETES A PROJECT
//------------------

app.get('/blogs/delete/:id', (req, res) => {
  const id = req.params.id
  if (req.session.isLoggedIn==true && req.session.isAdmin==true) {
    db.run("DELETE FROM blog WHERE blog_id=?", [id], function (error, theBlogs){
      if (error) {
        const model = { 
          style: "home.css",
          dbError: true, theError: error,
          isLoggedIn: req.session.isLoggedIn,
          name: req.session.name,
          isAdmin: req.session.isAdmin,
        }
        res.render("home.handlebars", model)
      } else {
        const model = { 
          style: "home.css",
          dbError: false, theError: "",
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
  res.redirect("/blogs")
})

//------------------
// CONTACT SUBMIT
//------------------
app.get('/contact', (req, res) => {
    const model={
      style: "contact.css",
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
      }
    res.render('contact.handlebars', model)
})


app.post('/contact/new', (req, res) => {
  const newp = [
    req.body.contactname, req.body.contactemail, req.body.contactdesc
  ]
  db.run("INSERT INTO submit (submit_name, submit_email, submit_desc) VALUES (?, ?, ?)", newp, (error) => {
    if (error) {
      console.log("ERROR: ", error)
    } else {
      console.log("Line added into the Submit table!")
    }
    res.redirect('/')
  })
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

// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});
