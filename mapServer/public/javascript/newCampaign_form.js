const address = window.location.origin
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (form.password.value != form.confirmPassword.value) {
        alert("Both password fields must be identical!")
    }
    else {

        let formData = {
            mode: "register",
            campaignName: form.campaignName.value,
            password: form.password.value
        }

        $.post(`${address}/dm/campaign/login`, formData, (data, status, jqXHR) => {
            if (status == "success") {
                const response = data.val
                if (response == "unavailable") {
                    alert("Campaign name already in use")
                }
                else if (response == "success") {
                    console.log(formData)
                    formData.mode = "login"

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
                                setCookie("dmToken", `${token}`, 1)
                                console.log("Cookie saved!")
                                console.log(token)
                                window.location.replace(`${address}/dm/campaign?campaign=${form.campaignName.value}`)
                            }
                        }
                        else {
                            alert("Oops! Something went wrong")
                        }
                    })
                }
                else {
                    alert("Invalid response from server. Try again later")
                }
            }
            else {
                alert("Oops! Something went wrong. Try again later")
            }
        })
    }
})