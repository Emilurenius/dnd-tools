import {textFormat} from "/static/javascript/codeify.js"
const address = window.location.origin
const newMapButton = document.getElementById("addMapButton")
const mapContainer = document.getElementById("maps")

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

const campaign = window.location.search.split("&")[0].split("=")[1]
newMapButton.href = `/dm/campaign/add?add=map&campaign=${campaign}`

const campaignData = getJSON(`${address}/dm/campaign/json?campaign=${campaign}`)
console.log(campaignData)
const maps = campaignData.maps

for (let index = 0; index < maps.length; index++) {
    let imageURL = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${maps[index]}`
    console.log(imageURL)
    const img = document.createElement("img")

    img.src = imageURL
    mapContainer.appendChild(img)
}