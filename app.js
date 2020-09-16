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
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")

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

    app.get('/',(req,res)=>{
        Postagem.find().lean()
        .populate("categoria")
        .sort({data: "desc"})
        .then((postagens)=>{
            
                res.render('index',{postagens: postagens})
        }).catch((err)=>{
            req.flash("error_msg","Erro Interno!")
            res.redirect("/404")
        })

        
    })

    app.get('/postagem/:slug',(req,res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                    res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg","Essa postagem não existe!")
                res.redirect("/")    
            }

        }).catch((err)=>{
            req.flash("error_msg","Erro Interno!")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req,res)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("categorias/index",{categorias: categorias})


        }).catch((err)=>{
            req.flash("error_msg","Erro Interno ao listar categorias!")
            res.redirect("/")
        })

    })

    app.get("/categorias/:slug", (req,res)=>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{

            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens) =>{
                    
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})

                }).catch((err)=>{
                    req.flash("error_msg","Erro Interno ao listar posts!")
                    res.redirect("/")
                })

            }else{
                req.flash("error_msg", "Essa categoria não existe!")
                res.redirect("/")
            }
            
        }).catch((err)=>{
            req.flash("error_msg","Erro Interno ao carregar a pagina!")
            console.log(err)
            res.redirect("/")
        })

    })

    app.get('/404',(req,res)=>{
        res.send("ERRO 404!")
    })
    
    app.use(bodyParser.urlencoded({extended: true}))


   

//outros

const PORT = 8081
    app.listen(PORT,() =>{
        console.log("Server Rodando!")
    })
