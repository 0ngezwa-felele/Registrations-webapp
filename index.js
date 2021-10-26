const reg = require('./reg');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;


const app = express();


// accessing public files
app.use(session({
    secret: 'add a secret',
    resave: false,
    saveUninitialized: true
}))
app.use(express.static('public'));
// Allowing files to communicate with each other(bodyParser)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(flash())

// Setting view engine to handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_reg';
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});
let regInstance = reg(pool)
app.get('/', function (req, res) {
    res.render('index')
})
app.post('/reg', async function (req, res, next) {
    try {
        let input = req.body.field
        console.log(await regInstance.getReg())
        if(input != ''){
            await regInstance.insert(input)
        }
        res.render('index',{model: await regInstance.getReg()})
    } catch (error) {
        next(error)
    }
})
app.post('/reset', async function(req, res){
        await regInstance.reset();
            res.redirect('/')
    
    })

const PORT = process.env.PORT || 1992
app.listen(PORT, function () {
    console.log('App started at port:', PORT)
})
