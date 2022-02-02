const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const bcrypt = require('bcrypt');
const port=8000;
const app= express();
const User=require('./models/User');
mongoose.connect('mongodb://localhost/userData');

app.use(bodyParser.json());

app.listen(port, ()=>{
	console.log(`server is listening on port:${port}`)
})
app.get('/users',(req,res)=>{
  User.find(
    (err,data)=>{
      sendResponse(res,err,data);
  })
})
// CREATE
app.post('/users',async (req,res)=>{
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  User.create(
    {
      name:req.body.newData.name,
      email:req.body.newData.email,
      password:await bcrypt.hash(req.body.newData.password, salt)
    },
    (err,data)=>{
      sendResponse(res,err,data);
  })
})

app.route('/users/:id')
// READ
.get((req,res)=>{
  User.findById(req.params.id,(err,data)=>{
    sendResponse(res,err,data);
  })
})
// UPDATE
.put(async(req,res)=>{
  const salt = await bcrypt.genSalt(10);
  User.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body.newData,

      password:await bcrypt.hash(req.body.newData.password, salt)

    },
    {
      new:true
    },
    (err,data)=>{
      sendResponse(res,err,data);
    }
  )
})
// DELETE
.delete((req,res)=>{
  User.findByIdAndDelete(
    req.params.id,
    (err,data)=>{
      sendResponse(res,err,data);
    }
  )
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
function crypt(password,rounds){
  bcrypt.hash(password, rounds, (err, hash) => {
    if (err) {
      console.error(err)
      return
    }
    return hash
  })
}