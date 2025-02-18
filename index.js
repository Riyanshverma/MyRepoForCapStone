import express from "express"
import bodyParser from "body-parser"
import axios from "axios"

const app = express()
const port = 3000

app.get("/",(req, res)=>{
    res.status(200).send("<h1>Hello world</h1>");
});

app.listen(port, (req, res)=>{
    console.log(`Listening to port ${port}`)
})