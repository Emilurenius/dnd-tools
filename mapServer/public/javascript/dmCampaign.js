import {textFormat} from "/static/javascript/codeify.js"
const address = window.location.origin
const container = document.getElementById("container")

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

campaignData = getJson(`${address}/dm/campaign/json`)