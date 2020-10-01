if(process.env.NODE_ENV == 'production'){

    module.exports = {mongoURI : "mongodb+srv://db_app_user:ARr9JCVKr30pqPtU@cluster0.jxfyr.gcp.mongodb.net/Blog_NodeJs?retryWrites=true&w=majority"}

}else{

    module.exports = {mongoURI: "mongodb://localhost/blogapp"}

}