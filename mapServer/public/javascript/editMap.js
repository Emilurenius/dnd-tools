const address = window.location.origin
const mapContainer = document.getElementById("maps")
const campaign = window.location.search.split("&")[0].split("=")[1]
const map = window.location.search.split("&")[1].split("=")[1]
const canvas = document.getElementById("mapEditorCanvas")

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

const img = new Image()
img.src = `${address}/dm/campaign/getimage?campaign=${campaign}&imageName=${map}`

function renderCanvas() {
    const ctx = canvas.getContext("2d")

    // Resize canvas:
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    const newImageWidth = canvas.width * 0.4
    const widthDiff = newImageWidth - img.width
    console.log(widthDiff)

    // Render image:
    console.log(img.width)
    console.log(img.height)
    console.log(newImageWidth)

    if (canvas.width > 425) {
        console.log(canvas.width)
        ctx.drawImage(img, canvas.width * 0.28, 20, newImageWidth, img.height + widthDiff)
    }
    else {
        ctx.drawImage(img, canvas.width * 0.18, 200, newImageWidth + 90, img.height + widthDiff + 90)
    }

    let painting = false

    function startPosition(e) {
        painting = true
    }
    function finishedPosition() {
        painting = false
        ctx.beginPath()
    }
    function draw(e) {
        if (!painting) return
        ctx.lineWidth = 10
        ctx.lineCap = "round"
    }

    canvas.addEventListener("mousedown", startPosition)
    canvas.addEventListener("mouseup", finishedPosition)
    canvas.addEventListener("mousemove", draw)
}

window.addEventListener("load", renderCanvas)

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight - 30 - 84 - 20
    canvas.width = window.innerWidth

    renderCanvas()
})