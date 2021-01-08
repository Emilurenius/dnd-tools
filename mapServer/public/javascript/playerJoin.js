const address = window.location.origin
const form = document.getElementById("playerLogin")

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

try {
    const ID = window.location.search.split("&")[1].split("=")[1]
    console.log(ID)
    form.ID.value = ID
}
catch (err) {
    console.log("No ID registered")
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const formData = {
        ID: form.ID.value,
        pin: form.pin.value,
        username: form.username.value
    }

    $.post(`${address}/player/login`, formData, (data, status, jqXHR) => {
        if (status == "success") {
            const playerToken = data.playerToken

            if (playerToken == false) {
                alert("ID or pin code is wrong")
            }
            else {
                setCookie("playerToken", playerToken, 1)
                setCookie("userName", formData.username, 1)
                setCookie("playerCampaignID", formData.ID, 1)
                console.log(`Cookies set:\nplayerToken: ${playerToken}userName: \n${formData.username}\nplayerCampaignID: ${formData.ID}`)

                window.location.replace(`${address}/player/campaign`)
            }
        }
        else {
            alert("Oops! Something went wrong. Try again later")
        }
    })
})

const queries = window.location.search.split("&")
if (queries.length > 2) {
    console.log("yes")
    const ALERT = queries[2].split("=")[1]
    alert(ALERT)
}