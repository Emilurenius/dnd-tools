// import {textFormat} from "/static/javascript/codeify.js"
const address = window.location.origin
const campaign = window.location.search.split("&")[0].split("=")[1]
const newMapButton = document.getElementById("addMapButton")
const mapContainer = document.getElementById("maps")
const generateInviteButton = document.getElementById("generateInviteButton")

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

console.log(window.location.search)

newMapButton.href = `/dm/campaign/add?add=map&campaign=${campaign}`

const campaignData = getJSON(`${address}/dm/campaign/json?campaign=${campaign}`)
console.log(campaignData)
const maps = campaignData.maps

for (let index = 0; index < maps.length; index++) {
    let imageURL = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${maps[index]}`
    console.log(imageURL)
    const img = document.createElement("img")
    img.classList.add("map")
    img.src = imageURL

    const imgDiv = document.createElement("div")
    imgDiv.classList.add("Content-box")

    imgDiv.appendChild(img)
    imgDiv.appendChild(document.createElement("br"))

    const editButton = document.createElement("input")
    editButton.type = "button"
    editButton.value = "Edit map"
    editButton.classList.add("button")
    imgDiv.appendChild(editButton)

    mapContainer.appendChild(imgDiv)
}

generateInviteButton.addEventListener("click", () => {
    const inviteData = getJSON(`${address}/dm/campaign/generateinvite?campaign=${campaign}`)
    console.log(inviteData)
})