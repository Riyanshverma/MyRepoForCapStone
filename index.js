import express, { response } from "express"
import bodyParser from "body-parser"
import axios from "axios"


const app = express()
const port = 3000
const Weather_API = "openuv-d24zcrm7a5saos-io"
const LogIn_API = "http://localhost:4000"

// Middleware
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res)=>{
    res.status(200).render("login.ejs")
});

app.post("/login-form", async (req, res)=>{
    console.log(req.body)
    try{
        const response = await axios.post(`${LogIn_API}/confirmation`, req.body)
        console.log(response.data.message)
        res.status(200).redirect("/front-page")
    }catch(error){
        res.status(401).send(`<h1>${error.message}</h1>`)
    }
})

app.get("/front-page", (req, res) => {
    res.render("front-page.ejs")
})

app.listen(port, (req, res)=>{
    console.log(`Backend server is running on http://localhost:${port}`)
})