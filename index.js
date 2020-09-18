const express = require('express');
let app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const Greetings = require("./registrations");
const greet = Greetings();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.engine('handlebars', exphbs({
    layoutsDir: './views/layouts'
}));

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get("/", function(req, res) {
    res.render("index");
});
app.post("/reg_numbers", function(req, res) {
    let value = req.body.input
        // let town = req.body.opt
    let adding = greet.validate(value)

    res.render("index", {
        reg: adding
    });
});
// app.get("/reg_numbers", function(req, res) {
//     let all = greet.allTheRegs()

//     res.render("index");
// });


const PORT = process.env.PORT || 3003;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});