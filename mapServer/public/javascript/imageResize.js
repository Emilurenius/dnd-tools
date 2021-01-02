const address = window.location.origin
const campaign = window.location.search.split("&")[0].split("=")[1]
const mapName = window.location.search.split("&")[1].split("=")[1]
const form = document.getElementById("resizeForm")
const canvas = document.getElementById("imageContainer")

function draw() {
    console.log("Drawing image")
    const con = canvas.getContext("2d")
    con.clearRect(0, 0, canvas.width, canvas.height)
    console.log(form.scale.value)
    if (form.scale.value >= 0) {
        con.drawImage(mapImage, 0, 0, mapImage.width + mapImage.width * form.scale.value / 1000, mapImage.height + mapImage.height * form.scale.value / 1000)
    }
    else {
        con.drawImage(mapImage, 0, 0, mapImage.width + mapImage.width * form.scale.value / 1000, mapImage.height + mapImage.height * form.scale.value / 1000)
    }
}

form.campaign.value = campaign
form.mapName.value = mapName

const imageURL = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${mapName}`

mapImage = new Image()
mapImage.src = imageURL
mapImage.onload = () => {
    draw()
}

form.scale.onmouseup = () => {
    draw()
}