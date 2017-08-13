var express = require("express");
app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//app congig
mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});
app.set( "view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//mongoose model
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//restfull routes 
app.get("/", function (req,res){
  res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function (req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("err");
    } else {
       res.render("index", {blogs: blogs});
    }
  });
 
});

// NEW
app.get("/blogs/new", function (req,res){
   res.render("new");
});

//CREATE
app.post("/blogs", function (req,res){
  Blog.create(req.body.blog, function (err, newBlog){
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW

app.get("/blogs/:id", function (req, res ){
  Blog.findById(req.params.id, function (err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

//index
app.listen(5000, function(){
  console.log("server is listening on channel 5000");
}); 