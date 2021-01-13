import {textFormat} from "/static/javascript/codeify.js"
const address = window.location.origin
const campaign = window.location.search.split("&")[0].split("=")[1]
const newMapButton = document.getElementById("addMapButton")
const mapContainer = document.getElementById("maps")
const generateInviteButton = document.getElementById("generateInviteButton")
const inviteLinkContainer = document.getElementById("inviteLinkContainer")

function getJSON(url) {
    var j = []
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) { j = data},
        async: false
    })
    return j
}

function updateInviteData(mode="generate") {
    if (mode == "generate") {
        inviteLinkContainer.innerHTML = ""
        const inviteData = getJSON(`${address}/dm/campaign/generateinvite?campaign=${campaign}&mode=generate`)
        console.log(inviteData)

        const link = `${address}/player?mode=join&ID=${inviteData.ID}`
        const text = `Invite link: <link,${link},${link}>\nPin code: ${inviteData.pin}`

        inviteLinkContainer.appendChild(textFormat(text, "Body-Text-alignLeft"))
        inviteLinkContainer.classList.remove("hidden")
        inviteLinkContainer.classList.add("Content")
    }
    else if (mode == "check") {
        const inviteData = getJSON(`${address}/dm/campaign/generateinvite?campaign=${campaign}&mode=check`)

        if (inviteData.ID != false) {
            inviteLinkContainer.innerHTML = ""
            console.log(inviteData)
            const link = `${address}/player?mode=join&ID=${inviteData.ID}`
            const text = `Invite link: <link,${link},${link}>\nPin code: ${inviteData.pin}`

            inviteLinkContainer.appendChild(textFormat(text, "Body-Text-alignLeft"))
            inviteLinkContainer.classList.remove("hidden")
            inviteLinkContainer.classList.add("Content")
        }
    }
}
updateInviteData("check")

newMapButton.href = `/dm/campaign/add?add=map&campaign=${campaign}`

const campaignData = getJSON(`${address}/dm/campaign/json?campaign=${campaign}`)
console.log(campaignData)
const maps = campaignData.maps

for (let index = 0; index < maps.length; index++) {
    let imageURL = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${maps[index]}`
    const img = document.createElement("img")
    img.classList.add("map")
    img.src = imageURL

    const imgDiv = document.createElement("div")
    imgDiv.classList.add("Content-box")

    imgDiv.appendChild(img)
    imgDiv.appendChild(document.createElement("br"))

    const editButton = document.createElement("a")
    editButton.innerHTML = "Edit map"
    editButton.href = `${address}/dm/campaign/editmap?campaign=${campaign}&map=${maps[index]}`
    editButton.classList.add("button")
    imgDiv.appendChild(editButton)

    mapContainer.appendChild(imgDiv)
}



generateInviteButton.addEventListener("click", () => {
    updateInviteData()
})