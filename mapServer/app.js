// Setup start
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()
const fs = require("fs")
const bcrypt = require("bcrypt")
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
// functions end

app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.
app.set("view engine", "ejs")
app.use(express.urlencoded({extended:false}))

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
            res.send("Load campaign page")
        }
    }
    else {
        console.log("\nDM menu opened:")
        res.sendFile(path.join(__dirname, "/html/dmMenu.html"))
    }
})

app.post("/dm/campaign/login", async (req, res) => {

    if (req.body.mode == "register") {
        const campaignName = req.body.campaignName
        const password = req.body.password
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        
        const campaignJSON = {
            "name": campaignName,
            "password": hashedPass,
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
    else{
        res.send(`${req.query.mode} is not a valid mode`)
    }
})

app.post("/comparePass", async (req, res) => { // Just for reference. Will be removed soon
    const isEqual = await bcrypt.compare(req.body.pass, hashedPass)
    if (isEqual) {
        res.send("Logged in!")
    }
    else {
        res.send("Wrong password!")
    }
})


app.listen(port, () => console.log(`Server started on port ${port}`))