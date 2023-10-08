const express = require('express');
const { engine } = require('express-handlebars');

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

app.get('/', (req, res) => {
    res.render('home.handlebars')
})

// run the server and make it listen to the port
app.listen(port, () => {
    console.log(`Server running and listening on port ${port}...`)
});
