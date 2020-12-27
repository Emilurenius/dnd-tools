const address = window.location.href
const form = document.getElementById("createCampaignForm")

console.log(address)

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

form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (form.password.value != form.confirmPassword.value) {
        alert("Both password fields must be identical!")
    }
    else {
        console.log("Form submitted")
    }
})