const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const port=8000;
const app= express();

app.use(bodyParser.json());

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})

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