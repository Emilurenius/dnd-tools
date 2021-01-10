// Setup start
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()
const fs = require("fs")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const upload = require("express-fileupload")
//Setup end

// Global variables start:
let usedIDs = {}
// Global variables end

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
app.use(cookieParser()) // Middleware for handling cookies
app.use(upload()) // Fileupload system

app.use("/static", express.static("public"))


app.get("/", (req, res) => {
    console.log("\nMain page loaded:")
    res.sendFile(path.join(__dirname, "/html/index.html"))
})


// DM get addresses:
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
    
    if (campaignData.dmToken.val == req.cookies.dmToken && campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {
        console.log("\nCampaign page loaded:")
        res.sendFile(path.join(__dirname, "/html/dmCampaign.html"))
    }
    else {
        res.redirect("/dm?mode=loadCampaign&alert=Invalid_dmToken._Please_log_in")
    }
})

app.get("/dm/campaign/json", (req, res) => {
    const campaignData = loadJSON(path.join(__dirname, `/campaigns/${req.query.campaign}/campaignData.json`), sync=true)

    if (campaignData.dmToken.val == req.cookies.dmToken && campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {
        console.log("JSON data for campaign requested")
        const cleanedCampaignData = {
            "maps": Object.keys(campaignData.maps),
            "lore": campaignData.lore
        }
        res.send(cleanedCampaignData)
    }
    else {
        res.send({ "verified": false })
    }
})

app.get("/dm/campaign/add", (req, res) => {
    const campaignData = loadJSON(path.join(__dirname, `/campaigns/${req.query.campaign}/campaignData.json`), sync=true)

    if (campaignData.dmToken.val == req.cookies.dmToken && campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {
        if (req.query.add == "map") {
            console.log("\nAdd map page loaded:")
            const campaign = req.query.campaign
            console.log(`Campaign selected: ${campaign}`)
            res.sendFile(path.join(__dirname, "/html/dmNewMap.html"))
        }
    }
    else {
        res.redirect("/dm?mode=loadCampaign&alert=Invalid_dmToken._Please_log_in")
    }
})

app.get("/dm/campaign/getimage", (req, res) => {
    const campaignData = loadJSON(path.join(__dirname, `/campaigns/${req.query.campaign}/campaignData.json`), sync=true)

    if (campaignData.dmToken.val == req.cookies.dmToken && campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {
        console.log("Image is being sent to client")
        res.sendFile(campaignData.maps[req.query.imageName].link)
    }
    else {
        res.send({"verified": false})
    }
})

app.get("/dm/campaign/generateinvite", (req, res) => {
    const campaignData = loadJSON(path.join(__dirname, `/campaigns/${req.query.campaign}/campaignData.json`), sync=true)

    if (campaignData.dmToken.val == req.cookies.dmToken && campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {
        if (req.query.mode == "generate") {
            console.log(`\nNew invite link for ${req.query.campaign} is being generated:`)
            const currentTime = Date.now()

            for ([key, val] of Object.entries(usedIDs)) {
                if (usedIDs[key].created < Date.now() - 1000 * 60 * 60 * 24) {
                    console.log(usedIDs[key])
                    delete usedIDs[key]
                    console.log("Outdated key deleted")
                }
                else if (usedIDs[key].campaign == req.query.campaign) {
                    console.log(usedIDs[key])
                    delete usedIDs[key]
                    console.log(`Old invite link for ${req.query.campaign} deleted`)
                }
            }

            let ID = undefined
            let pin = undefined
            while (true) {

                ID = randInt(1111111111, 9999999999)
                pin = randInt(1111, 9999)

                if (ID in usedIDs) {
                    if (usedIDs[ID].created > currentTime - 1000 * 60 * 60 * 24) {
                        continue
                    }
                    else {
                        delete usedIDs[ID]
                        break
                    }
                }
                else {
                    break
                }
            }
            response = {
                "ID": ID,
                "pin": pin
            }
            console.log(`ID and pin generated:\nID: ${ID}\npin: ${pin}`)

            usedIDs[ID] = {
                created: currentTime,
                pin: pin,
                campaign: req.query.campaign,
                players: {}
            }
            console.log(`ID and pin assigned to ${req.query.campaign}`)
            res.send(response)
        }
        else if (req.query.mode == "check") {
            console.log(`Existing ID and pin requested for ${req.query.campaign}`)

            for ([key, val] of Object.entries(usedIDs)) {
                if (usedIDs[key].created < Date.now() - 1000 * 60 * 60 * 24) {
                    console.log(usedIDs[key])
                    delete usedIDs[key]
                    console.log("Outdated key deleted")
                }
            }
            let found = false
            for ([key, val] of Object.entries(usedIDs)) {
                if (usedIDs[key].campaign == req.query.campaign) {
                    res.send({
                        "ID": key,
                        "pin": usedIDs[key].pin
                    })
                    console.log("Existing ID and pin sent to client")
                    found = true
                    break
                }
            }
            if (found == false) {
                console.log("No valid ID or pin found")
                res.send({ "ID": false })
            }
        }
    }
    else {
        res.send({"verified": false})
    }
})

// DM post addresses:
app.post("/dm/campaign/login", async (req, res) => {

    if (req.body.mode == "register") {
        console.log("\nCampaign creator started:")
        const campaignName = req.body.campaignName
        const password = req.body.password
        const hashedPass = await bcrypt.hash(password, 10)
        
        const campaignJSON = {
            "name": campaignName,
            "password": hashedPass,
            "dmToken": {
                "val": null,
                "created": null
            },
            "maps": {},
            "lore": {}
        }

        fs.mkdir(path.join(__dirname, `/campaigns/${campaignName}`), (err) => {
            if (err) {
                res.send({"val": "unavailable"})
            }
            else {
                saveJSON(path.join(__dirname, `/campaigns/${campaignName}/campaignData.json`), campaignJSON)
                fs.mkdir(path.join(__dirname, `/campaigns/${campaignName}/mapImages`), (err) => {
                    if (err) {
                        res.send({"val": "unavailable"})
                    }
                    else {
                        res.send({"val": "success"})
                    }
                })
            }
        })
    }
    else if (req.body.mode == "login") {
        console.log("\nLogin initiated:")
        const campaignName = req.body.campaignName
        const password = req.body.password

        if (fs.existsSync(path.join(__dirname, `campaigns/${campaignName}`))) {
            const campaignData = loadJSON(path.join(__dirname, `campaigns/${campaignName}/campaignData.json`), sync=true)
            const isEqual = await bcrypt.compare(password, campaignData.password)
            if (isEqual) {

                if (campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {
                    console.log("Valid token found!")
                    res.send({ "val": campaignData.dmToken.val })
                    console.log("Existing token transferred")
                }
                else {
                    const dmToken = randInt(1111111111, 9999999999)
                    campaignData.dmToken.val = dmToken
                    campaignData.dmToken.created = Date.now()
                    saveJSON(path.join(__dirname, `/campaigns/${campaignName}/campaignData.json`), campaignData)

                    res.send({ "val": `${dmToken}` })
                    console.log("dmToken transferred")
                }
            }
            else {
                res.send({ "val": false })
                console.log("Wrong password given")
            }
        }
        else {
            res.send({"val": "nonexistent"})
        }
    }
    else{
        console.log(`\nInvalid mode given to /dm/campaign/login: ${req.body.mode}`)
        res.send(`${req.body.mode} is not a valid mode`)
    }
})

app.post("/dm/campaign/add", (req, res) => {
    const campaignData = loadJSON(path.join(__dirname, `campaigns/${req.body.campaign}/campaignData.json`), sync=true)

    if (campaignData.dmToken.val == req.cookies.dmToken && campaignData.dmToken.created > Date.now() - 1000 * 60 * 60 * 24) {

        if (req.body.add == "image") {
            console.log("New map image recieved")

            const campaign = req.body.campaign
            const file = req.files.image
            const filename = file.name
            const filetype = filename.split(".")[1]
            console.log(`Filetype found: ${filetype}`)
            const newFilename = req.body.mapName
            console.log(`Filename found: ${newFilename}.${filetype}`)

            const legalFileTypes = ["jpg", "png"]
            if (legalFileTypes.includes(filetype)) {
                console.log("Filetype legal")
                file.mv(path.join(__dirname, `/campaigns/${campaign}/mapImages/${newFilename}.${filetype}`), (err) => {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        console.log("File saved")

                        campaignData.maps[`${newFilename}.${filetype}`] = {
                            "link": path.join(__dirname, `/campaigns/${campaign}/mapImages/${newFilename}.${filetype}`),
                            "scale": undefined
                        }

                        saveJSON(path.join(__dirname, `campaigns/${req.body.campaign}/campaignData.json`), campaignData)

                        res.redirect(`/dm/campaign?campaign=${campaign}`)
                    }
                })
            }
            else {
                console.log("Invalid filetype!")
                res.send("Invalid filetype!")
            }
        }
    }
    else {
        res.redirect("/dm?mode=loadCampaign&alert=Invalid_dmToken._Please_log_in")
    }
})


// Player get addresses:
app.get("/player", (req, res) => {
    if (req.query.mode) {
        if (req.query.mode == "join") {
            console.log("\nJoin campaign dialouge for players initiated")
            res.sendFile(path.join(__dirname, "/html/playerJoin.html"))
        }
    }
    else {
        console.log("\nPlayer menu loaded")
        res.sendFile(path.join(__dirname, "/html/playerMenu.html"))
    }
})

app.get("/player/campaign", (req, res) => {
    console.log("\nPlayer campaign page loaded:")
    const playerTokenData = usedIDs[parseInt(req.cookies.playerCampaignID)].players[req.cookies.userName]
    if (playerTokenData.playerToken == req.cookies.playerToken && playerTokenData.created > Date.now() - 1000 * 60 * 60 * 24) {
        res.sendFile(path.join(__dirname, "/html/playerCampaign.html"))
    }
    else {
        res.redirect("/player?join&alert=Invalid_token._Please_log_in")
    }
})

app.get("/player/campaign/json", (req, res) => {
    console.log("Player campaign data requested")
    const playerTokenData = usedIDs[parseInt(req.cookies.playerCampaignID)].players[req.cookies.userName]
    const campaign = usedIDs[parseInt(req.cookies.playerCampaignID)].campaign
    if (playerTokenData.playerToken == req.cookies.playerToken && playerTokenData.created > Date.now() - 1000 * 60 * 60 * 24) {
        const campaignData = loadJSON(path.join(__dirname, `/campaigns/${campaign}/campaignData.json`), sync=true)

        const cleanedCampaignData = {
            "maps": Object.keys(campaignData.maps),
            "lore": campaignData.lore
        }

        res.send(cleanedCampaignData)
    }
    else {
        res.send({ "verified": false })
    }
})

app.get("/player/campaign/getimage", (req, res) => {
    console.log("map requested by player")
    const playerTokenData = usedIDs[parseInt(req.cookies.playerCampaignID)].players[req.cookies.userName]
    const campaign = usedIDs[parseInt(req.cookies.playerCampaignID)].campaign
    const campaignData = loadJSON(path.join(__dirname, `/campaigns/${campaign}/campaignData.json`), sync=true)
    console.log(campaignData.maps[req.query.imageName])

    if (playerTokenData.playerToken == req.cookies.playerToken && playerTokenData.created > Date.now() - 1000 * 60 * 60 * 24) {
        console.log("Image is being sent to client")
        res.sendFile(campaignData.maps[req.query.imageName].link)
    }
    else {
        res.send({"verified": false})
    }
})


// Player post addresses:
app.post("/player/login", (req, res) => {
    for ([key, val] of Object.entries(usedIDs)) {
        if (usedIDs[key].created < Date.now() - 1000 * 60 * 60 * 24) {
            console.log(usedIDs[key])
            delete usedIDs[key]
            console.log("Outdated key deleted")
        }
    }
    
    const ID = req.body.ID
    const pin = req.body.pin
    const username = req.body.username

    if (ID in usedIDs) {
        if (pin == usedIDs[ID].pin) {
            const campaign = usedIDs[ID].campaign
            console.log(`\nGenerating playerToken for ${username} to access ${campaign}`)
            const playerToken = randInt(1111111111, 9999999999)

            usedIDs[ID].players[username] = {
                playerToken: playerToken,
                created: Date.now()
            }
            console.log(`playerToken saved to ${username}: ${playerToken}`)
            res.send({ "playerToken": playerToken })
        }
        else {
            res.send({ "playerToken": false })
        }
    }
    else {
        res.send({ "playerToken": false })
    }
})


// Other:
app.get("/favicon", (req, res) => {
    console.log("Favicon requested")
    res.sendFile(path.join(__dirname, "/public/images/favicon.ico"))
})

app.get("*", (req, res) => { // This one has to be the last defined address
    console.log("Unknown page requested!\nRedirecting to main page")
    res.redirect("/")
})


app.listen(port, () => console.log(`Server started on port ${port}`))