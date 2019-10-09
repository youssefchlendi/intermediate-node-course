const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();
const User=require('./models/User')
const Topic=require('./models/Topic')
const Response=require('./models/Response')
const seedDB=require('./seedDB');
seedDB()

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/userData')
app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})

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


