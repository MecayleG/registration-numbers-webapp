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
    let upper = value.toUpperCase();
    if (value !== "") {
        if (/C[ALJ] \d{3,5}$/.test(upper) || /C[ALJ] \d+\s|-\d+$/.test(upper)) {
            if (await registrations.ifRegExists(upper) === 0) {
                await registrations.adding(upper)
                req.flash('msg', 'success')
            } else {
                req.flash('info', 'registration number already entered')
            }
        } else {
            req.flash('info', 'enter a valid registration number')
        }
    } else {
        req.flash('info', 'enter a registration number')
    }
    res.render("index", {
        reg: await registrations.allTheRegs()
    });
});


app.get("/reg_numbers", async function(req, res) {
    let town = req.query.opt;
    let all = await registrations.optionSelected(town)

    res.render("index", {
        reg: all
    });

});


const PORT = process.env.PORT || 3003;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});