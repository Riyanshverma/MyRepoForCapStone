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

async function changeTime(date){
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Change to false for 24-hour format
    });
    const newTime = formattedDate + " " + formattedTime;
    return newTime 
}

async function setWarning(uvIndex){
    if(uvIndex<=2){
        return "Low"
    } else if(uvIndex<=5){
        return "Moderate"
    } else if(uvIndex<=7){
        return "High"
    } else{
        return "Very High"
    }
}
async function warningMessage(uvIndex){
    if(uvIndex<=2){
        return "No protection needed. You can safely stay outside."
    } else if(uvIndex<=5){
        return "Use sun protection if you will be outside for more than 30 minutes."
    } else if(uvIndex<=7){
        return "Use sun protection. Avoid being outside during midday hours."
    } else{
        return "Use sun protection. Avoid being outside as much as possible."
    }
}

async function setGradient(uvIndex){
    if(uvIndex <= 2) {
        return "#00FF00, #008000, #006400"
    } else if(uvIndex <= 5) {
        return "#FFFF00, #FFD700, #FFA500"
    } else if(uvIndex <= 7) {
        return "#FFA500, #FF4500, #FF6347"
    } else if(uvIndex <= 10) {
        return "#FF0000, #8B0000, #B22222"
    } else {
        return "#800080, #4B0082, #9400D3"
    }
}

app.post("/uv-details", async (req, res) => {
    console.log(req.body)
    try {
        // const response = await axios.get(`${Weather_API}/uv?lat=${req.body.lattitude}&lng=${req.body.longitude}&alt=${req.body.altitude}`, config)
        const data = apiResponce // Storing the data that came from the API.
        console.log(data)

        const uvData = {
            uvIndex: data.uv, // Yes
            uvTime: await changeTime(data.uv_time),
            uvIndexMax: data.uv_max, // Yes
            uvMaxTime: await changeTime(data.uv_max_time),
            safeExposureTime: data.safe_exposure_time,
            uvWarning: await setWarning(data.uv), // Yes
            warningMessage: await warningMessage(data.uv), // Yes
            gradientString: await setGradient(data.uv), // Yes 
            maxGradientString: await setGradient(data.uv_max) // Yes
        }
        const sunData = {
            sunRise: await changeTime(data.sun_info.sun_times.sunrise),
            sunSet: await changeTime(data.sun_info.sun_times.sunset),
            sunSetStart: await changeTime(data.sun_info.sun_times.sunsetStart),
            sunRiseEnd: await changeTime(data.sun_info.sun_times.sunriseEnd),
        }
        console.log(uvData, "\n", sunData)
        res.render("front-page.ejs", 
            {
                uvData: uvData,
                sunData: sunData,
            }
        )
    } catch (error) {
        console.log(error.message)
        res.status(500).send(`<h1>${error.message}</h1>`)
    }
})

app.listen(port, (req, res) => {
    console.log(`Backend server is running on http://localhost:${port}`)
})


const apiResponce = {
    uv: 0,
    uv_time: '2025-02-23T15:58:17.849Z',
    uv_max: 7.6063,
    uv_max_time: '2025-02-23T07:12:16.340Z',
    ozone: 282.9,
    ozone_time: '2023-04-12T15:04:31.773Z',
    safe_exposure_time: { st1: null, st2: null, st3: null, st4: null, st5: null, st6: null },
    sun_info: {
      sun_times: {
        solarNoon: '2025-02-23T07:12:16.340Z',
        nadir: '2025-02-22T19:12:16.340Z',
        sunrise: '2025-02-23T01:28:39.833Z',
        sunset: '2025-02-23T12:55:52.848Z',
        sunriseEnd: '2025-02-23T01:31:05.773Z',
        sunsetStart: '2025-02-23T12:53:26.908Z',
        dawn: '2025-02-23T01:05:11.249Z',
        dusk: '2025-02-23T13:19:21.432Z',
        nauticalDawn: '2025-02-23T00:38:06.559Z',
        nauticalDusk: '2025-02-23T13:46:26.122Z',
        nightEnd: '2025-02-23T00:11:09.289Z',
        night: '2025-02-23T14:13:23.392Z',
        goldenHourEnd: '2025-02-23T02:00:02.198Z',
        goldenHour: '2025-02-23T12:24:30.483Z'
      },
      sun_position: { azimuth: 1.7666476505753292, altitude: -0.7239599362819749 }
    }
  }