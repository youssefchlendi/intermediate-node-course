# Intermediate Node.js

## 1. Intro and Setup

Hey there, fellow programmer!

Welcome to the Intermediate Node.js course! If you are taking this course, I am assuming you know the basics of Node.js and Express.js. If not, a good place to start is the [intro to node and express](https://lab.github.com/everydeveloper/introduction-to-node-with-express) course, here on GitHub Learning Lab. 

In this tutorial, you will learn how to connect your server to a NoSQL database called MongoDB. You will also learn how to refactor repetative code, to make it easier to maintain. By the end of this you will have built an API that does the following:

* Create, Read, Update, and Destroy (CRUD) documents in MongoDB
* Sign up users and protect their passwords with Bcrypt.
* Populated nested models with Mongoose lifecycle hooks.

This is an interactive tutorial. At the end of each section, you will be prompted to do something to continue. If you don't get a response right away, try refreshing your browser.

*Leave a comment on this issue to continue*

## 1.1 Install

*Great* let's get this project started!

First, by signing up for this class, a starter repository was copied to your GitHub account. Start by cloning this project and installing dependencies:

```console
git clone {{ repoUrl }}
cd intermediate-node-course
npm install
```

You will also need to install the free community edition of [MongoDB](https://www.mongodb.com/download-center/community) for your OS. After installing, you will need to add the path do the MongoDB bin to your environment variables. Create a `/data/db` directory in your root directory. This is where the local documents will be saved.

You will need to close and reopen your console before the new environment variables are registured. Test if it is installed with this command: `mongod --version`. If you see a version printed, then start up the database server by entering: `mongod`.

We are going to be testing our API using Postman. You can install it for free [here](https://www.getpostman.com/downloads/)

There are some express routes already setup in the server.js file. Also, we are using the "nodemon" package in this so that our server restarts automatically. Open a new console and start the server by running this command:`npm run start`. You should see the message from our app.listen method and some statements about nodemon watching for changes. 

If you have all the following done, close this issue for the next steps.

- [] MongoDB installed and configured
- [] Node.js and Git installed and configured
- [] Project cloned and dependencies installed
- [] Postman installed
- [] A console running the local mongoDB server (with the "mongod" commmand)
- [] A console with "nodemon" watching your server.js file.

## 2. Create a User Model

Let's start by making a User model for mongodb using the mongoose library. This will be the template used to describe what each individual *document* will look like in our *collection*.

Create a file in the "model" directory called "User.js" and add this code to it:

```js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports= mongoose.model('User',UserSchema)
``` 

Looks like a JS object doesn't it? That is one of the cool things about MongoDB, it is easy to transfer data from the frontend to the backend. Think of this as a factory, or mold, that can create new User documents in a User collection. 

## 2.1 Add User Methods to Express Routes

Let's start using this model to create some users. Go to your server.js file and add this line on line 10 (after all the libraries are imported).

```javascript
const User=require('./models/User');
mongoose.connect('mongodb://localhost/userData')
```

The first line is going to import the User model we just made, and the second is going to connect us to a local mongoDB database called: *userData*. If this does not exist yet, it will create it for you. Make sure you use different database names if you work on other projects. 

In the server.js file, you will notice some place-holder routes for the '/users' endpoint. It should look like this:

```javascript

app.route('/users')
.post((req,res)=>{
	// code goes here
})
.get((req,res)=>{
	// code goes here
})
.put((req,res)=>{
	// code goes here
})
.delete((req,res)=>{
	// code goes here
})

```
We are using route chaining here as a shorthand. All of these routes will use the '/users' endpoint. Insert this in the post route so it looks like this:

```javascript
.post((req,res)=>{
	User.create(
		{
			name:req.body.user.name,
			email:req.body.user.email,
			password:req.body.user.password
		},
		(err,data)=>{
		if (err){
			res.json({
		    success: false,
		    message: err
		  })
		} else if (!data){
			res.json({
		    success: false,
		    message: "Not Found"
		  })
		} else {
			res.json({
		    success: true,
		    data: data
		  })
		}
	})
})
```
When you want to make a new *document* in MongoDB, you can simply call the "create" method on your mongoose model. It's first argument is an object containing the values for the new document. The next argument is a callback function, which handles the response from the database.

## 2.3 Testing Route

Ok let's start up Postman and set up a post request to: http://localhost:8000/users

Under the Headers tab, add this key/value pair:

Content-Type : application/json

Next, go to the body tab and select raw JSON, then paste this in the text under it:

```json
{
	"user":{
		"name":"Jim",
		"email":"jim@email.com",
		"password":"asdasdasdasdsasada"
	}
}
```

Send the post request, and see if you get a successful response. Notice that there is an "_id" key automatically created. This will be important later. Try posting the same data again. You should get an error with the code: 11000, with a duplicate email key. 

To understand why this happened, remember that we said each email should be unique in the model. 
```javascript

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true }
});
```

## 2.4 Adding other routes

Ok, lets add a route to find a user by their id. Insert this code in the "get" route:

```javascript
.get((req,res)=>{
	User.findById(req.body.id,(err,data)=>{
		if (err){
			res.json({
		    success: false,
		    message: err
		  })
		} else if (!data){
			res.json({
		    success: false,
		    message: "Not Found"
		  })
		} else {
			res.json({
		    success: true,
		    data: data
		  })
		}
	})
})
```

This time we used the User.findById method, which will search for the unique id given to it by mongoDB. The callback specifies what to do after the method has finished running. 

Before we write the next request, let's make this into a function so we avoid writing repetitive code:

```javascript
function sendResponse(res,err,data){
	if (err){
		res.json({
	    success: false,
	    message: err
	  })
	} else if (!data){
		res.json({
	    success: false,
	    message: "Not Found"
	  })
	} else {
		res.json({
	    success: true,
	    data: data
	  })
	}
}
```
We can shorten the post route for new user by object spread syntax like this: `{...req.body.user}`. This will create a copy of each key/value pair in the req.body.user object. 

Now we can refactor the routes like this:

```javascript
app.route('/users')
.post((req,res)=>{
	User.create(
		{...req.body.user},
		(err,user)=>{sendResponse(res,err,user)})
})
.get((req,res)=>{
	User.findById(
		req.body.id,
		(err,user)=>{sendResponse(res,err,user)})
})
.put((req,res)=>{
	User.findByIdAndUpdate(
		req.body.id,
		{...req.body.user},
		(err,user)=>{sendResponse(res,err,user)})
})
.delete((req,res)=>{
	User.findByIdAndDelete(
		req.body.id,
		(err,user)=>{sendResponse(res,err,user)})
})
```

Great! You can test this out by posting a new user, copying the returned id, and sending it in a "get" request with this json data in the body:

```json
{
	"id":"UserIDGoesHere"
}
```

Let's add the last two methods before moving forward.

If you want to update a document in mongoDB, you can do it with the User.findByIdAndUpdate method. This takes three arguments (id, update, callback).

To delete a document, you can use the User.findByIdAndDelete method, which takes an id and callback as arguments. After adding these routes, our routes should look like this:

```javascript
app.route('/users')
.post((req,res)=>{
	User.create(
		{...req.body.user},
		(err,user)=>{sendResponse(res,err,user)})
})
.get((req,res)=>{
	User.findById(
		req.body.id,
		(err,user)=>{sendResponse(res,err,user)})
})
.put((req,res)=>{
	User.findByIdAndUpdate(
		req.body.id,
		{...req.body.user},
		(err,user)=>{sendResponse(res,err,user)})
})
.delete((req,res)=>{
	User.findByIdAndDelete(
		req.body.id,
		(err,user)=>{sendResponse(res,err,user)})
})
```

Test out these routes in Postman to make sure they are working as expected.

## 3. Populating nested documents

One of the nice things about MongoDB is that you can reference the IDs of documents in other collections, and easily retrieve the data associated with them.

Create a new file in your "models" folder called "Topic.js" and paste this code inside it.

```javascript
const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true  },
	responses: [{ type: mongoose.Schema.Types.ObjectId, ref:"Response"}]
});

TopicSchema.pre('find',function(next){
	this.populate('author','name')
	this.populate('responses')
	next()
})

module.exports= mongoose.model('Topic',TopicSchema)
```

When we create an instance of a topic, we can store the author's "_id" property (assigned by mongoDB) and then "populate" the author's info (so it is always up to date). We added a "pre" hook to the model that, in this case, will populate the author's name, and an array of nested responses. When you call next(), it will proceed with returning the query. 

We haven't made a Response model yet, but notice that it is enclosed in square brakets. This means that an array of ID's will be stored here (and can be populated all at once).

Let's make that Response model, by creating a file called "Response.js" in the "models" folder.

```javascript
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
	comment: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
	topic: { type: mongoose.Schema.Types.ObjectId, ref:"Topic" }
});

ResponseSchema.pre('find',function(next){
	this.populate('author','name')
	next()
})

module.exports= mongoose.model('Response',ResponseSchema)
```

## 4. Adding New Routes

Alright, let's go back to our server.js file and import those new models. 

```javascript
const Topic=require('./models/Topic');
const Response=require('./models/Response');
```

Now, we could just copy and paste our routes, and replace the routes for each model. That would look something like this:

```javascript
app.route('/users')
.post((req,res)=>{
	User.create(
		{...req.body.user},
		(err,user)=>{sendResponse(res,err,user)})
})
.get((req,res)=>{
	User.findById(
		req.body.id,
		(err,user)=>{sendResponse(res,err,user)})
})
.put((req,res)=>{
	User.findByIdAndUpdate(
		req.body.id,
		{...req.body.user},
		(err,user)=>{sendResponse(res,err,user)})
})
.delete((req,res)=>{
	User.findByIdAndDelete(
		req.body.id,
		(err,user)=>{sendResponse(res,err,user)})
})

app.route('/topics')
.post((req,res)=>{
	Topic.create(
		{...req.body.topic},
		(err,topic)=>{sendResponse(res,err,topic)})
})
.get((req,res)=>{
	Topic.findById(
		req.body.id,
		(err,topic)=>{sendResponse(res,err,topic)})
})
.put((req,res)=>{
	Topic.findByIdAndUpdate(
		req.body.id,
		{...req.body.topic},
		(err,topic)=>{sendResponse(res,err,topic)})
})
.delete((req,res)=>{
	Topic.findByIdAndDelete(
		req.body.id,
		(err,topic)=>{sendResponse(res,err,topic)})
})

app.route('/responses')
.post((req,res)=>{
	Response.create(
		{...req.body.response},
		(err,response)=>{sendResponse(res,err,response)})
})
.get((req,res)=>{
	Response.findById(
		req.body.id,
		(err,response)=>{sendResponse(res,err,response)})
})
.put((req,res)=>{
	Response.findByIdAndUpdate(
		req.body.id,
		{...req.body.response},
		(err,response)=>{sendResponse(res,err,response)})
})
.delete((req,res)=>{
	Response.findByIdAndDelete(
		req.body.id,
		(err,response)=>{sendResponse(res,err,response)})
})

```
However, this is the advanced Node.js tutorial! It might be easy to copy and paste once, but maintaining three things is much more tedious than only one thing. Let's make these route-sets into a single function, that we can just call for each model.

```javascript
function setUpRoutes(route,Model){
	app.route(route)
	.post((req,res)=>{
		Model.create(
			{...req.body.newData},
			(err,data)=>{sendResponse(res,err,data)})
	})
	.get((req,res)=>{
		Model.findById(
			req.body.id,
			(err,data)=>{sendResponse(res,err,data)})
	})
	.put((req,res)=>{
		Model.findByIdAndUpdate(
			req.body.id,
			{...req.body.updateData},
			(err,data)=>{sendResponse(res,err,data)})
	})
	.delete((req,res)=>{
		Model.findByIdAndDelete(
			req.body.id,
			(err,data)=>{sendResponse(res,err,data)})
	})
}

setUpRoutes('/users',User);
setUpRoutes('/topics',Topic);
setUpRoutes('/responses',Response);
``` 

Now we can use these CRUD (Create, Read, Update, Delete) routes for as many collections as we want! 🤩

There should be a file in your project called "seedDB". This has a function which will clear the collections, then create a documents of each. Seeding a database can save you time when you are testing routes. Feel free to use this to test the routes by importing it at the top and then calling the function:

```javascript
const seedDB=require('./seedDB');
seedDB()
```
Just remember, this will clear your data each time your server re-starts, so take it out when you are done testing!

## 5. Protecting Passwords

The last thing I want to go over is encrypting your user's passwords with a library called "bcrypt". We can do this automatically by creating a lifecycle hook in our Users model:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function(inputPassword, callback) {
    return callback(null, bcrypt.compareSync(inputPassword, this.password));
};

module.exports= mongoose.model('User',UserSchema)
```

Each time a User document is going to be saves, it does the following:
1. Checks if the password has not been modified
2. If it has been modified (or is new) it will encrypt it (make it look like a bunch of gobbledygook)
3. If the compare password method is called (when logging in) it will decrypt the stored password, and check if it matched what was entered.

Let's finish by adding a login route to our server.js file:

```javascript
app.post('/login',async (req,res)=>{
	try {
    var user = await User.findOne({ email: req.body.email }).exec();
    if(!user) {
      return res.json({ 
      	success:false,
      	message: "User not found" 
      });
    }
    user.comparePassword(req.body.password, (error, match) => {
      if(!match) {
        return res.json({ 
        	success:false,
        	message: "password does not match" 
        });
      }
    });
    res.json({ 
    	success: true,
    	message: "The username and password combination is correct!" 
    });
	} catch (error) {
	    res.json({
	    	success:false,
	    	message:error
	    });
	}
})
```

Test this out in Postman by creating a "post" request to "http://localhost:8000/login".
If you are using the seed data, you can enter this json data into the body of the request:

```json
{
	"email":"jack@email.com",
	"password":"beanstock"
}
```

## 6. Next Steps

And with that, you are finished! However, there is still much more you can do with Node.js Express.js and Mongoose.js. I focused on sending JSON data, since this is pretty flexible and useful in making single page apps. If you want to continue with this app, here are some possible next steps for you:

1. Make a front-end to this application, using [AJAX](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) to make requests from the API.
2. Add up-vote and down-vote keys to the Topic model, (allowing users to hit the "put" route with their votes).
3. Use [JSON Web Token](https://jwt.io/) to authenticate after a successful log-in.
4. Write a check-token function to authorize different routes (for example, post requests only work on a user's profile if they have a valid token).