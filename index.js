import express from "express"
import bodyParser from "body-parser"
import axios from "axios"


const app = express()
const port = 3000
const Weather_API = "openuv-d24zcrm7a5saos-io"
const LogIn_API = "http://localhost:4000"

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.get("/", (req, res)=>{
    res.status(200).send("<h1>Hello world</h1>");
});

app.listen(port, (req, res)=>{
    console.log(`Backend server is running on http://localhost:${port}`)
})