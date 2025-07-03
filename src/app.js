const express = require('express')
const app = express()

// NOTE: Order of the Routes Matters !!

// 1) This will only match '/' and return this respose(hello ayush) for all other like =>  /test , /hello
// 2) This will match all the HTTP method for home
// app.use('/',(req,res)=>{
// res.send("Hello Ayush !!!")
// })


// 1) This will match all the HTTP method for hello
// app.use('/hello',(req,res)=>{
// res.send("Hello Hello hello !!!")
// })

// 1) This will match all the HTTP method for test
// app.use('/test',(req,res)=>{
// res.send("Welcome to Test Route")
// }) 


// ----------------------------------X--------------------------------


// 1) This will match only GET method for home
// app.get('/',(req,res)=>{
// res.send("Hello Ayush !!!")
// })

// 1) This will match only POST method for home
// app.post('/',(req,res)=>{
// res.send("Hello Ayush !!!")
// })


app.get('/users',(req,res)=>{
res.send({name:"AYUSH",age:27})
})

app.post('/users',(req,res)=>{
console.log("Saved data to DB")
res.send("Data posted Sucessfully")
})


app.listen(7777,()=>{
    console.log("Server is Listening at 7777")
})