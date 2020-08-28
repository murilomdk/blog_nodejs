const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Console } = require("console")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/',(req,res) => {
    res.render("admin/index")
})


router.get('/posts',(req,res) => {
    res.send("Pagina de Post")
})


router.get('/categorias',(req,res) => {
    Categoria.find().lean().sort({date:'desc'}).then((categorias)=> {
        res.render('admin/categorias',{categorias: categorias})

    }).catch((err) => {
        req.flash("error_msg","Erro ao apresentar categorias")
        res.redirect('/admin')
    })
    
})

router.get('/categorias/add',(req,res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova',(req,res)=>{

    var erros = []

    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido!"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno!"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros: erros})
        console.log(erros)
    }else{

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg","Categoria criada com sucesso!")
            res.redirect("/admin/categorias")

        }).catch((err)=>{
            req.flash("error_msg","Erro ao salvar categoria!")
                      
        })
    }

})

router.get('/categorias/edit/:id',(req,res)=> {

        Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editcategorias",{categoria: categoria})
    }).catch((err)=> {
        req.flash("error_msg","Esta categoria não existe")
        res.redirect("/admin/categorias")
    })        

})

router.post("/categorias/edit",(req,res)=>{

    console.log("nome" + req.body.id)

    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
            
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

            categoria.save().then(()=>{
                req.flash("success_msg", "Categoria EDITADA")
                res.redirect("/admin/categorias")              

            }).catch((err)=>{
            req.flash("error_msg","Ocorreu um erro interno!")
            res.redirect("/admin/categorias")
            })

    }).catch((err)=>{
        req.flash("erro_msg","Erro ao atualizar categoria")
        res.redirect("/admin/categorias")
    })
})  

router.post("/categorias/delete",(req,res)=>{
        
        Categoria.remove({_id: req.body.id}).then((categoria)=>{
            req.flash("success_msg","Categoria Removida")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("erro_msg","Erro ao deletar categoria")
            res.redirect("/admin/categorias")
        })


}) 

router.get('/postagens',(req,res)=> {

    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens}) 
        
    }).catch((err)=>{
        req.flash("erro_msg","Erro ao carregar Postagens")
        res.redirect("/admin/")
    })         
 
 })

 router.get('/postagens/add',(req,res)=> {
    Categoria.find().lean().then((categorias) =>{
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch((err)=>{
        req.flash("erro_msg","Erro ao carregar categorias")
        res.redirect("/admin/")
    })          
 
 })

 router.post('/postagens/nova',(req,res)=>{
    
    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "titulo inválido"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagens",{erros: erros})
        console.log(erros)
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem salva com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("erro_msg","Erro ao salvar postagem")
            res.redirect("/admin/postagens")
        })
        

    }

 })


 router.get('/postagens/edit/:id',(req,res)=> {

    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{

        Categoria.find().lean().then((categorias)=>{
            res.render("admin/editpostagens",{postagem: postagem, categorias: categorias})

        }).catch((err)=> {
            req.flash("error_msg","Erro ao listar categoria")
            res.redirect("/admin/postagens")
        })    
        
    
}).catch((err)=> {
    req.flash("error_msg","Esta postagem não existe")
    res.redirect("/admin/postagens")
})        

})

 router.post('/postagens/edit', (req,res)=>{

    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo

        postagem.save().then(()=>{
            req.flash("success_msg","Postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("erro_msg","Erro interno ")
            res.redirect("/admin/postagens")
        })


    }).catch((err)=>{
        req.flash("error_msg","Erro ao Salvar a edição!")
        res.redirect("/admin/postagens")
    })

 })

 router.get('/postagens/deletar/:id',(req,res)=>{
    Postagem.remove({_id: req.params.id}).then(()=>{
        req.flash("success_msg","Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")

    }).catch((err)=>{
        req.flash("error_msg","Erro deletar postagem!")
        res.redirect("/admin/postagens")
    })

 })


router.get('/testeMK',(req,res)=> {

   res.render('admin/teste')      

})

router.post('/teste/inputs',(req,res)=> {

    res.send("Bairro recebido foi: " + req.body.bairroBrenda +' e a cidade foi : ' + req.body.cidadeBrenda)     
 
 })


module.exports = router