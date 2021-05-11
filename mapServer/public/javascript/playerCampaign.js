const address = window.location.origin
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

const campaignData = getJSON(`${address}/player/campaign/json`)
console.log(campaignData)
const maps = campaignData.maps

for (let index = 0; index < maps.length; index++) {
    let imageURL = `${address}/player/campaign/getimage?imageName=${maps[index]}`
    console.log(imageURL)
    const img = document.createElement("img")
    img.classList.add("map")
    img.src = imageURL

    const imgDiv = document.createElement("div")
    imgDiv.classList.add("Content-box")

    imgDiv.appendChild(img)

    mapContainer.appendChild(imgDiv)
}