const address = `${window.location.origin}${window.location.pathname}`
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
        console.log(form.password.value)
        let tempForm = $(`<form action="/dm/campaign/login" method="post" style="display: none;"> <input type="text" name="mode" value="register"> <input type="text" name="campaignName" value="${form.campaignName.value}"> <input type="text" name="password" value="${form.password.value}"> </form>`);
        $('body').append(tempForm);
        tempForm.submit();
    }
})