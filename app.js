const express = require("express")
const app = express();
const dotenv = require('dotenv')
const bcryptjs = require('bcryptjs')
const session = require("express-session");
const connection = require("./database/db");
const passport = require("passport")
const { isLoggedIn } = require('./lib/auth')



//capture the date of the form
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

dotenv.config({path:'./env/.env'})


app.use('/resources', express.static('public'))
app.use('/resources', express.static(__dirname + '/public'))


app.set('view engine', 'ejs')

app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))



app.get('/', isLoggedIn, (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})




//save register

app.post('/register', async(req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.password;
    let passwordHaash = await bcryptjs.hash(pass, 8)
    connection.query('INSERT INTO users SET ?', {username:user, name:name, rol:rol, password:passwordHaash}, async(error, results)=>{
        if(error) {
            console.log(error)
        }else {
            res.render("register" ,{
                alert: true,
                alertTitle:"Registration",
                alertMessage:"Sucessful Registration!",
                alertIcon: "sucess",
                showConfirmButton: false,
                timer: 1500,
                ruta: ''

            })
            

        }
    })
})


app.post('/auth', async(req, res) => {
    const user = req.body.user
    const password = req.body.password
    let passwordHaash = await bcryptjs.hash(password, 8)
    if(user && password) {
        connection.query('SELECT * FROM users WHERE username = ?', [user], async(error, results)=> {
            if(results.length == 0 || !(await bcryptjs.compare(password, results[0].password))){
                res.render("login" ,{
                    alert: true,
                    alertTitle:"Error",
                    alertMessage:"Password or user incorrect!",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
    
                })   
                
            }else {
                res.render("index" ,{
                    alert: true,
                    alertTitle:"Login",
                    alertMessage:"Sucessful Login!",
                    alertIcon: "sucess",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''          
    
                })

                 
                
                
            }
        })
    }

})
    





app.listen('3000', (req, res) => {
    console.log("SERVER ON")
})