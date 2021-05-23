'use strict'

const express = require('express');
const app = express()
const cors= require('cors')
require('dotenv').config();
const superagent = require('superagent');
const { error } = require('console');
const PORT= process.env.PORT || 3030;
// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/home',homehandler);
app.get('/search',searchHandler);
app.get('/results',resultsHandler);
app.get('/mylist',mylistHandler);
let jobsArr=[];
function homehandler(req,res){
    let url= `https://jobs.github.com/positions.json?location=usa`
    superagent.get(url)
    .then(jobdata=>{
        
        let jData= jobdata.body;
      
        jData.forEach(item=>{
            jobsArr.push(new Job(item))
            res.render('home',{jobs:jobsArr})
        })
    })
    .catch(error=>{
        res.send(error)
    })    
}
function searchHandler(req,res){
    res.render('search')
}
 let desArr=[];
function resultsHandler(req,res){
    let desc=req.query.des;
let url =`https://jobs.github.com/positions.json?description=${desc}&location=usa` 
superagent.get(url)
.then(jobDes=>{
    let jDes= jobDes.body;
    jDes.forEach(item=>{
        desArr.push(new JobDes(item))
        res.render('results',{jobs:desArr})
    })
})
}
function mylistHandler(req,res){

};

function Job(data){
    this.title= data.title;
    this.company=data.company;
    this.location= data.location;
    this.url=data.url;
    this.description =data.description 
}
function JobDes(data){
    this.title= data.title;
    this.company=data.company;
    this.location= data.location;
    this.url=data.url;
    this.description =data.description; 
}
 app.listen(PORT,()=>{
     console.log(PORT)
 });
  


   
