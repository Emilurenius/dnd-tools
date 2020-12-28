// Setup start
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()
const fs = require("fs")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
//Setup end

// Reading input from terminal start
const port = parseInt(process.argv[2])
console.log(`${port} registered as server port`)
// Reading input from terminal end

// functions start
function saveJSON(filename, dict) {
    json = JSON.stringify(dict, null, 4)
    fs.writeFile(filename, json, "utf8", (err) => {
        if (err) {
            console.log("An error occured while writing JSON Object fo File")
        } else {
            console.log("JSON file saved")
        }
    })
}

function loadJSON(filename, sync=false) {
    if (sync == true) {
        let rawdata = fs.readFileSync(filename)
        return JSON.parse(rawdata)
    } else {
        fs.readFile(filename, (err, data) => {
            if (err) throw err
            return JSON.parse(data)
        })
    }
}

function randInt(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
// functions end

app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use("/static", express.static("public"))


app.get("/", (req, res) => {
    console.log("\nMain page loaded:")
    res.sendFile(path.join(__dirname, "/html/index.html"))
})

app.get("/dm", (req, res) => {

    if (req.query.mode) {
        if (req.query.mode == "newCampaign") {
            console.log("\nNew campaign dialouge initiated:")
            res.sendFile(path.join(__dirname, "/html/newCampaign.html"))
        }
        else if (req.query.mode == "loadCampaign") {
            console.log("\nLoad campaign dialouge initiated:")
            res.sendFile(path.join(__dirname, "/html/campaignLogin.html"))
        }
    }
    else {
        console.log("\nDM menu opened:")
        res.sendFile(path.join(__dirname, "/html/dmMenu.html"))
    }
})

app.get("/dm/campaign", (req, res) => {
    const campaignData = loadJSON(path.join(__dirname, `/campaigns/${req.query.campaign}/campaignData.json`), sync=true)
    
    if (campaignData.token.val == req.cookies.token) {
        res.sendFile(path.join(__dirname, "/html/dmCampaign.html"))
    }
    else {
        res.redirect("/dm?mode=loadCampaign")
    }
})

app.post("/dm/campaign/login", async (req, res) => {

    if (req.body.mode == "register") {
        console.log("\nCampaign creator started:")
        const campaignName = req.body.campaignName
        const password = req.body.password
        const hashedPass = await bcrypt.hash(password, 10)
        
        const campaignJSON = {
            "name": campaignName,
            "password": hashedPass,
            "token": {
                "val": null,
                "created": null
            },
            "maps": {},
            "lore": {}
        }

        fs.mkdir(path.join(__dirname, `/campaigns/${campaignName}`), (err) => {
            if (err) {
                res.send("ERR: Directory could not be created. The name of the campaign might already be taken.")
            }
            else {
                saveJSON(path.join(__dirname, `/campaigns/${campaignName}/campaignData.json`), campaignJSON)
                res.send("Campaign created!")
            }
        })
    }
    else if (req.body.mode == "login") {
        const campaignName = req.body.campaignName
        const password = req.body.password

        const campaignData = loadJSON(path.join(__dirname, `campaigns/${campaignName}/campaignData.json`), sync=true)
        const isEqual = await bcrypt.compare(password, campaignData.password)
        if (isEqual) {
            const token = randInt(1111111111, 9999999999)
            campaignData.token.val = token
            campaignData.token.created = Date.now()
            saveJSON(path.join(__dirname, `/campaigns/${campaignName}/campaignData.json`), campaignData)

            res.send({"val": `${token}`})
            console.log("Token transferred")
        }
        else {
            res.send({"val": false})
            console.log("Wrong password given")
        }
    }
    else{
        console.log(`\nInvalid mode given to /dm/campaign/login: ${req.body.mode}`)
        res.send(`${req.body.mode} is not a valid mode`)
    }
})


app.listen(port, () => console.log(`Server started on port ${port}`))