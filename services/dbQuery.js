const userModel=require('../models/users');
module.exports ={
	update : async  (condition, set, options) => {
		options.lean = true;
		return new Promise((resolve, reject) => {
			userModel.update(condition, set, options, (err,data)=>{
				if(err){
					console.log("error on update query================",err)
					reject(err);
				}
				else{
					resolve(data);  
				}
			})
		});
	},
	findOne:async(criteria,projection,options)=>{
		options.lean = true;
		return new Promise((resolve, reject) => {
			userModel.findOne(criteria, projection, options, (err,data)=>{
				if(err){
					console.log("error on findOne query================",err)
					reject(err);
				}
				else{
					resolve(data);  
				}
			})
		});
	},
	find:async(criteria)=>{
		return new Promise((resolve, reject) => {
			userModel.aggregate(criteria,(err,data)=>{
				if(err){
					console.log("error on find query================",err)
					reject(err);
				}else{
					resolve(data);  
				} 
			})
		})
	},
	delete: async(criteria) => {
		return new Promise((resolve, reject) => {
			userModel.findOneAndRemove(criteria, (err,data)=>{
				if(err){
					console.log("error on delete query================",err)
					reject(err);
				}else{
					resolve(data);  
				}
			})
		});
	},
	getCount : async  (criteria) => {
		return new Promise((resolve, reject) => {
			userModel.countDocuments(criteria, (err,data)=>{
				if(err){
					console.log("error on getCount query================",err)
					reject(err);
				}
				else{
					resolve(data);  
				}
			})
		});
	}
}