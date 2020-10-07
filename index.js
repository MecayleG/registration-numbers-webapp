const express = require('express');
let app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const Registrations = require("./registrations");
const flash = require('express-flash');

const session = require('express-session');
app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://root:mecayle123@localhost:5432/registrations';

const pool = new Pool({
    connectionString
});

const registrations = Registrations(pool);

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

app.get("/", async function(req, res) {
    res.render("index", {
        reg: await registrations.allTheRegs()

    });
});
app.post("/reg_numbers", async function(req, res) {
    let value = req.body.input
        // let town = req.body.opt
    let validate = await registrations.validate(value)
    let add = await registrations.addToDb(value)
    if (value === "") {
        req.flash('info', 'enter a reg');
    }



    res.render("index", {
        reg: await registrations.allTheRegs()
    });
});


// app.get("/reg_numbers", function(req, res) {
//     let town = req.body.opt
//     let all = registrations.optionSelected(town)

//     res.render("index", {
//         reg: all
//     });
// });


const PORT = process.env.PORT || 3003;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});