//Carregar modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require("./routes/admin")
    const path = require("path")
    const mongoose = require("mongoose")
    const session = require('express-session')
    const flash = require("connect-flash")

    

//configuraçoes
    //Sessão
        app.use(session({
            secret: "cursoNode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    
    //Middleware
        app.use((req,res, next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        }) 


    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //Handleebars
        app.engine('handlebars', handlebars({defaultLayout:'main'}))
        app.set('view engine','handlebars')

    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
            console.log("Conectado ao MongoDB!")
        }).catch((err) =>{
            console.log("Erro ao conectar: " + err) 
        })

    //public
        app.use(express.static(path.join(__dirname,"public")))


//Rotas
    app.use('/admin',admin)
    
    app.use(bodyParser.urlencoded({extended: true}))

//outros

const PORT = 8081
    app.listen(PORT,() =>{
        console.log("Server Rodando!")
    })
