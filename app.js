var express = require("express");
require("dotenv/config")
var app = express();
var bodyparser = require("body-parser");
var sanitizer = require('sanitize')();
const nodemailer = require('nodemailer');
var mongoose = require("mongoose");
var flash = require("connect-flash")
var passport = require("passport");
var passportlocal = require("passport-local");
var passportlocalmongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var User = require("./models/user.js");
var Query = require("./models/query.js");
var Detail = require("./models/details.js");
var Tech = require("./models/tech.js")

mongoose.connect(process.env.MONGO_KEY, {
	
	useNewUrlParser: true
	
}).then(()=>{
	console.log("db connected")
}).catch(err =>{
	console.log("error",err.message)
});

mongoose.set('useFindAndModify', true);
mongoose.set('useFindAndDelete', true);


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ extended: true }));
// app.use(express.urlencoded({extended:false}));
app.use(require("express-session")({
	secret:"blah blah blah love is shit",
	resave:false,
	saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());


passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});


// routes//////////////////////


app.get("/",function(req,res){
	
	Tech.find(function(err,foundTechNews){
		if(err){
			console.log("dont find any news")
			console.log(err);
		}else{
			res.render("index.ejs" , {foundTechNews:foundTechNews})
			
		}
	})
});
app.get("/admin" ,isLoggedin, function(req,res){
	console.log(req.user.username)
	if(req.user.username === "aidataronofficial@gmail.com"){
		res.render("admin.ejs")
	}else{
		req.flash("Error" , "You dont have permission to access admin")
		res.redirect("/")
	}
	
})

app.post("/",isLoggedin, function(req,res){
	
	var heading = req.body.heading;
	var imglink = req.body.imglink;
	var postlink = req.body.postlink;
	if(req.user.username === "aidataronofficial@gmail.com"){
			Tech.create({heading:heading,image:imglink,post:postlink},function(err,newTechNews){
		if(err){
			console.log(err)
		}else{
			req.flash("Error" , "You dont have permission to access admin")
			res.redirect("/");
		}
	})
	}

	
	
})

app.get("/about",function(req,res){
	res.render("about.ejs")
});

app.get("/portfolio" , function(req , res){
	res.render("portfolio.ejs")
})

app.get("/contact",function(req,res){
	res.render("contact.ejs")
});

app.get("/upcomings" , function(req,res){
	res.render("upcomings.ejs")
});


app.get("/graphicdesigning",function(req,res){
	res.render("graphics-service.ejs")
});

// app.get("/web" , function(req,res){
// 	res.render("web.ejs")
// })

app.get("/webdevelopment",function(req,res){
	res.render("web-services.ejs")
});

app.get("/digitalmarketing",function(req,res){
	res.render("socialmedia.ejs")
});

app.get("/profile",isLoggedin,function(req,res){
	
	User.findById(req.user,function(err,foundUser){
		if(err){
			console.log(err);
		}else{
			Detail.findById(foundUser.details, function(err,founddetails){
				if(err){
					console.log(err);
				}else{
					var userdetails = [
						{
						contact:founddetails.contact,
						organization:founddetails.organization,
						country:founddetails.country
					}
					]
					res.render("profile.ejs",{userdetails:userdetails});
				}
			})
		}
	});
});

app.put("/profile",isLoggedin, function(req,res){
	var yourname = req.body.yourname;
	var contact = req.body.contact;
	var organization = req.body.organization;
	var country = req.body.country;
	User.findById(req.user._id,function(err,foundUser){
		if(err){
			console.log(err);
		}else{
			foundUser.update({yourname:yourname}, function(err,updatedUser){
				if(err){
					console.log(err);
				}else{
				}
			})
			
			Detail.findById(foundUser.details, function(err,founddetails){
				if(err){
					console.log(err);
				}else{
					founddetails.update({
						contact:contact,
						organization:organization,
						country:country
					}, function(err,updateddetails){
						if(err){
							console.log(err);
						}else{
							
						}
					})
				}
			})
			req.flash("success" , "Your changes have been saved")
			res.redirect("/profile");

		}
	})
})

app.get("/query",isLoggedin , function(req,res){
	res.render("query.ejs" )
});

app.post("/query" , isLoggedin, function(req,res){
	var subject = req.body.subject;
	var details = req.body.details;
	
	Query.create({subject:subject,details:details},function(err,newquery){
		if(err){
			console.log(err);
		}else{
			User.findById(req.user._id,function(err,foundUser){
				if(err){
					req.flash("error" , "user not found");
					console.log(err);
				}else{					
					const output = `
						<p>You have a new Query request</p>
						<h3>User Details</h3>
						<ul>  
						  <li>Name: ${req.user.yourname}</li>
						  <li>Email: ${req.user.username }</li>
						  <li>Phone: ${req.body.phone}</li>
						</ul>
						<h3>Details</h3>
						<p>${details}</p>
						`;

						// create reusable transporter object using the default SMTP transport
						let transporter = nodemailer.createTransport({
						host: 'smtp.google.com',
						port: 587,
						secure: false, // true for 465, false for other ports
						requireTLS: true,
						service:'gmail',
						auth: {
							user: 'queryaidataron@gmail.com', // generated ethereal user
							pass: 'nwnxovucjfoqqwww'  // generated ethereal password
						},
						});

						// setup email data with unicode symbols
						let mailOptions = {
						  from: '"User Query" <queryaidataron@gmail.com>', // sender address
						  to: 'aidataronofficial@gmail.com', // list of receivers
						  subject: subject, // Subject line
						  text: details, // plain text body
						  html: output // html body
						};

						// send mail with defined transport object
						transporter.sendMail(mailOptions, (error, info) => {
						  if (error) {
							  return console.log(error);
							  console.log("there is error");
						  }else{
							  console.log('Message sent: %s', info.messageId);   
							  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
							  
							 foundUser.querys.push(newquery);
							  foundUser.save();
							
							req.flash("success" , "Your query have been submitted. You will be respond soon")
							res.redirect("/");
						  }
						});
					
					
					
				}
			})
		}
	})
});

app.get("/privacypolicy" , function(req,res){
	res.render("privacypolicy.ejs")
});

app.get("/copyright" , function(req,res){
	res.render("copyright.ejs");
});

app.get("/ourstory" , function(req,res){
	res.render("ourstory.ejs")
});

app.get("/signup" , function(req,res){
	res.render("signup.ejs");
})

app.post("/signup",function(req,res){
 	var username=req.body.username;
	var yourname= req.body.yourname;
	User.register(new User({username:username , yourname:yourname}),req.body.password , function(err,user){
		if(err){
			console.log(err);
			req.flash("error" , err.message);
			return res.redirect("/signup");
		}
		passport.authenticate("local")(req,res ,function(){
			res.redirect("/complete_signup");
		});
	});
});

app.get("/complete_signup",isLoggedin , function(req,res){
	res.render("complete_signup.ejs");
});

app.post("/complete_signup",isLoggedin, function(req,res){
	var contact = req.body.contact;
	var organization=req.body.organization;
	var country=req.body.country;
	Detail.create({contact:contact,organization:organization,country:country},function(err,userDetails){
		if(err){
			console.log(err);
		}else{
			User.findById(req.user._id,function(err,foundUser){
				foundUser.details.push(userDetails);
				foundUser.save();
				req.flash("success" , "Welcome to Aidataron " + foundUser.yourname)
				res.redirect("/");
			})
		}
	});
	
});



app.get("/login",function(req,res){
	if( req.query.origin )
  req.session.returnTo = req.query.origin
else
  req.session.returnTo = req.header('Referer')

res.render('login.ejs')
	// res.render("login.ejs");
});

app.post('/login',passport.authenticate("local",{
	successReturnToOrRedirect: '/',
	failureRedirect: "/login",
	failureFlash: true
}),function(req,res){
	if(failureRedirect){
		console.log("wrong");
	}
	
});

 


app.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged u out")
	res.redirect("/");
});

app.get("/*" , function(req,res){
	res.render("pagenotfound.ejs");
})

function isLoggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You must login")
	res.redirect( `/login?origin=${req.originalUrl}` )
}


var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});