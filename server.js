import express from "express"
import bodyParser from "body-parser"

const app = express()
const port = 4000

const credentials = {
    username: "riyanshverma01",
    password: "password",
}

app.get("/confirmation", (req, res)=>{
    if(req.body.username === credentials.username && req.body.password === credentials.password){
        res.status(200).send("Login successful")
    }
    else{
        res.status(401).send("Invalid username or password")
    }
})

app.listen(port, ()=>{
    console.log(`API Server running at http://localhost:${port}`)
})