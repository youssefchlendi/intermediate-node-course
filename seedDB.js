const mongoose = require('mongoose');
const User=require('./models/User');
const Topic=require('./models/Topic');
const Response=require('./models/Response');

const userData=[
	{"name":"Jack","email":"jack@email.com","password":"beanstock"},
	{"name":"Jill","email":"jill@email.com","password":"hill"}
]


function seedDB(){
	User.deleteMany({},err=>{
		if(err){console.log(err)}
		Topic.deleteMany({},err=>{
			if(err){console.log(err)}
			Response.deleteMany({},err=>{
				if(err){console.log(err)}
				userData.forEach(user=>{
					User.create(user,(err,newUser)=>{
						if(err){
							console.log(err)
						} else{
							const topicData=
								{"title":"Why do Giants live in the sky?",
								"description":"I have always wondered that...",
								"author":newUser._id,
								"responses":[]}
									Topic.create(topicData,(err,newTopic)=>{
								if(err){
									console.log(err)
								} else{
								Response.create({"comment":"Not sure","author":newUser._id,"topic":newTopic._id},
									(err,newResponse)=>{
										if(err){
											console.log(err)
										} else{
											newTopic.responses.push(newResponse._id)
											newTopic.save(()=>{
												User.find({},(err,users)=>{console.log("users",users)})
												Topic.find({},(err,topics)=>{console.log("topics",
													topics, "a response",
													topics[0].responses)})
											})
										}
									})
								}
							})
						}
					})
				})	
			})
		})
	})	
}

module.exports= seedDB

