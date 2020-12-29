const address = window.location.origin
const form = document.getElementById("loginForm")

console.log(address)

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    const campaignName = form.campaignName.value
    const password = form.password.value

    const formData = {
        mode: "login",
        campaignName: campaignName,
        password: password
    }

    $.post(`${address}/dm/campaign/login`, formData, (data, status, jqXHR) => {
        if (status == "success") {
            const token = data.val
            if (token == false) {
                alert("wrong password")
            }
            else if (token == "nonexistent") {
                alert("Campaign does not exist")
            }
            else {
                console.log(token)
                setCookie("token", `${token}`, 1)
                console.log("Cookie saved!")
                console.log(token)
                window.location.replace(`${address}/dm/campaign?campaign=${campaignName}`)
            }
        }
        else {
            alert("Oops! Something went wrong")
        }
    })
})

const queries = window.location.search.split("&")
if (queries.length > 1) {
    console.log("yes")
    const ALERT = queries[1].split("=")[1]
    alert(ALERT)
}