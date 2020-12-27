// Setup start
const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()
const fs = require("fs")
//Setup end

// Reading input from terminal start
const port = parseInt(process.argv[2])
console.log(`${port} registered as server port`)
// Reading input from terminal end

app.use(cors()) // Making sure the browser can request more data after it is loaded on the client computer.

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


app.listen(port, () => console.log(`Server started on port ${port}`))