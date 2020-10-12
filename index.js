const express = require('express');
let app = express();

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const Registrations = require("./factory/registrations");
const routes = require("./routes/registration")
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
const regRoute = routes(registrations);

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

app.get("/", regRoute.showAll);
app.post("/reg_numbers", regRoute.add);
app.get("/reg_numbers", regRoute.filter);


const PORT = process.env.PORT || 3003;

app.listen(PORT, function() {
    console.log('App starting on port', PORT);
});