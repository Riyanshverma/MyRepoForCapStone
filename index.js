import express, { response } from "express"
import bodyParser from "body-parser"
import axios from "axios"


const app = express()
const port = 3000
const Weather_API_Key = "openuv-d24zcrm7a5saos-io"
const Weather_API = "https://api.openuv.io/api/v1"
const LogIn_API = "http://localhost:4000"

const config = {
    headers: {
        "x-access-token": Weather_API_Key,
        "Content-Type": "application/json",
    }

}

// Middleware
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.status(200).render("login.ejs")
});

app.post("/login-form", async (req, res) => {
    console.log(req.body)
    try {
        const response = await axios.post(`${LogIn_API}/confirmation`, req.body)
        console.log(response.data.message)
        res.status(200).redirect("/front-page")
    } catch (error) {
        res.status(401).send(`<h1>${error.message}</h1>`)
    }
})

app.get("/front-page", (req, res) => {
    res.render("front-page.ejs")
})

app.post("/uv-details", async (req, res) => {
    console.log(req.body)
    try {
        const response = await axios.get(`${Weather_API}/uv?lat=${req.body.lattitude}&lng=${req.body.longitude}&alt=${req.body.altitude}`, config)
        console.log(response.data.result)
        res.render("front-page.ejs", { data: response.data })
    } catch (error) {
        res.status(500).send(`<h1>${error.message}</h1>`)
    }
})

app.listen(port, (req, res) => {
    console.log(`Backend server is running on http://localhost:${port}`)
})