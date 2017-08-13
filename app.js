var express = require("express");
app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

//app congig
mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});
app.set( "view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//mongoose model
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//restfull routes 
app.get("/", function (req, res){
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
app.get("/blogs/new", function (req, res){
   res.render("new");
});

//CREATE
app.post("/blogs", function (req, res){
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

//EDIT (combination of NEW and SHOW)
app.get("/blogs/:id/edit", function (req, res){
  Blog.findById(req.params.id, function (err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog){
    if (err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DELETE
app.delete("/blogs/:id", function (req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});


app.listen(5000, function(){
  console.log("server is listening on channel 5000");
}); 