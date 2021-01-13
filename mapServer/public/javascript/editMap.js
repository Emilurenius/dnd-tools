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

    const newImageWidth = canvas.width * 0.8
    const widthDiff = newImageWidth - img.width
    console.log(widthDiff)

    // Render image:
    console.log(img.width)
    console.log(img.height)
    console.log(canvas.width * 0.8)
    ctx.drawImage(img, canvas.width * 0.1, 20, canvas.width * 0.8, img.height + widthDiff)

    let painting = false

    function startPosition(e) {
        painting = true
        draw(e)
    }
    function finishedPosition() {
        painting = false
        ctx.beginPath()
    }
    function draw(e) {
        if (!painting) return
        ctx.lineWidth = 10
        ctx.lineCap = "round"

        ctx.lineTo(e.clientX, e.clientY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(e.clientX, e.clientY)
    }

    canvas.addEventListener("mousedown", startPosition)
    canvas.addEventListener("mouseup", finishedPosition)
    canvas.addEventListener("mousemove", draw)
}

window.addEventListener("load", renderCanvas)

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    renderCanvas()
})