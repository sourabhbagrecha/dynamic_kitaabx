var express     =    require("express");
var app         =    express();
var methodOverride = require("method-override");
var expressSanitizer =  require("express-sanitizer");
var flash = require("connect-flash");
var passport =      require("passport");
var localStrategy = require("passport-local");
var bodyParser  =   require("body-parser");
var mongoose    =   require("mongoose");
var User        =   require("./models/user");
var session = require('express-session');
var redis   = require("redis");
var redisStore = require('connect-redis')(session);

mongoose.connect("mongodb://sourabh:sourabhb1@ds145881.mlab.com:45881/kitaabxfirst", { useNewUrlParser: true });


//requiring routes
var subjectRoutes = require("./routes/subjects.js"),
    indexRoutes   = require("./routes/index.js");

//app config

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, ttl :  260}),
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.yearInApp = [1,2,3,4];
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.branchInApp = [
        {sForm: "CS", title: "Computer Science"},
        {sForm: "IT", title: "Information Technology"},
        {sForm: "EX", title: "Electronics and Telecommunication"},
        {sForm: "ME", title: "Mechanical"},
        {sForm: "MX", title: "Mechatronics"},
        {sForm: "CV", title: "Civil"}
        ];
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/subjects", subjectRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server running!");
})