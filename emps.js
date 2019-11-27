var express = require('express');
var emp = express();
var joi = require('joi');
var config = require('config');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host : config.get("host"),
    database : config.get("database"),
    user : config.get("user"),
    password : config.get("password")
})

connection.connect();
emp.use(express.json());

function executeQuery(query,res){
    connection.query(query,(err,result)=>{
        if(err==null) res.send(JSON.stringify(result));
        else res.send(JSON.stringify(err));
    })
}

emp.get("/",(req,res)=>{
    var query = `select * from Emp`;
    executeQuery(query,res);
})

emp.get("/:No",(req,res)=>{
    var query = `select * from Emp where No=${req.params.No}`;
    executeQuery(query,res);
})

emp.delete("/:No",(req,res)=>{
    var query = `delete from Emp where No=${req.params.No}`;
    executeQuery(query,res);
})

emp.put("/:No",(req,res)=>{
    var query = `update Emp set Name='${req.body.Name}', Age=${req.body.Age} where No=${req.params.No}`;
    executeQuery(query,res);
})

function validate(req){
    var validateHeads = {
        No: joi.number().required(),
        Name: joi.string().required(),
        Age: joi.number().min(18).max(60).required()
    }

    return joi.validate(req.body, validateHeads);
}
emp.post("/",(req,res)=>{
    var resultVadidate = validate(req);
    if( resultVadidate.errror == null){
    var query = `insert into Emp values( ${req.body.No},'${req.body.Name}',${req.body.Age})`;
    executeQuery(query,res);
    }
    else{
        res.send(JSON.stringify(resultVadidate.errror));
    }
})

module.exports = emp;
