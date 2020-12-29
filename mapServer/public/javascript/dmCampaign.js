import {textFormat} from "/static/javascript/codeify.js"
const address = window.location.origin
const newMapButton = document.getElementById("addMapButton")

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