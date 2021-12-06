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
    var regex= /^((CA|CJ|CY)-\d{3})$/i;
    try {
        let input = req.body.field
        if (input === ""){
            req.flash('info','Please input your registration number')
            // (input = "")
        }
       else if(!regex.test(input)){
            req.flash('info','Please input a correct registration number.....')
            // (input = "")
        }
      else  if(input != '')
            await regInstance.insert(input)
            // req.flash('info','reg number added')
        
        res.render('index',{model: await regInstance.getReg()})
    } catch (error) {
        next(error)
    }
})
app.get('/show', async function (req, res){
    try {
        res.render('index', { added: await regInstance.getReg()})
    } catch (error) {
        console.log(error)
    }
})

app.get('/reg_numbers', async function(req, res){
    try {
        reg.render('index',{filtered: await regInstance.filter()})
    } catch (error) {
        console.log(error)
    }
})
app.post('/reg_numbers', async function (req, res) {
    let button = req.body.Town 
        let allRegs = await regInstance.filter(button)
      
        console.log(allRegs);
        res.render('index', { model: allRegs })
    });
    

app.post('/reset', async function(req, res){
        await regInstance.reset();
            res.redirect('/')
    
    })

const PORT = process.env.PORT || 1992
app.listen(PORT, function () {
    console.log('App started at port:', PORT)
})
