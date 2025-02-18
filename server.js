import express from "express"
import bodyParser from "body-parser"

const app = express()
const port = 4000

const username = "riyanshverma01"
const password = "password"

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/confirmation", (req, res)=>{
    console.log(req.body.password)
    if(req.body.username == username && req.body.password == password){
        console.log("The user is valid!")
        res.status(200).json({ message: "The user is ready to see the weather!!" })
    }else{
        console.log("Invalid user credentials!")
        res.status(401).json({ message: "Invalid username or password" })
    }
})

app.listen(port, ()=>{
    console.log(`API Server running at http://localhost:${port}`)
})