const address = window.location.origin
const mapContainer = document.getElementById("maps")
const campaign = window.location.search.split("&")[0].split("=")[1]
const map = window.location.search.split("&")[1].split("=")[1]

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

const campaignData = getJSON(`${address}/dm/campaign/json?campaign=${campaign}`)
console.log(campaignData)
const maps = campaignData.maps

const imgDiv = document.createElement("div")
imgDiv.classList.add("Content-box")

let imageURL = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${map}`
const img = document.createElement("img")
img.classList.add("map")
img.src = imageURL
imgDiv.appendChild(img)
mapContainer.appendChild(imgDiv)
console.log(img)

// for (let index = 0; index < maps.length; index++) {
//     let imageURL = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${maps[index]}`
//     const img = document.createElement("img")
//     img.classList.add("map")
//     img.src = imageURL

//     const imgDiv = document.createElement("div")
//     imgDiv.classList.add("Content-box")

//     imgDiv.appendChild(img)
//     imgDiv.appendChild(document.createElement("br"))

//     const editButton = document.createElement("input")
//     editButton.type = "button"
//     editButton.value = "Edit map"
//     editButton.classList.add("button")
//     imgDiv.appendChild(editButton)

//     mapContainer.appendChild(imgDiv)
// }