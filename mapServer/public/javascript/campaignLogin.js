const address = window.location.origin
const form = document.getElementById("loginForm")

console.log(address)

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
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
            setCookie("token", `${token}`, 1)
            console.log("Cookie saved!")
            console.log(token)

            window.location.replace(`${address}/dm/campaign?campaign=${campaignName}`)
        }
        else {
            alert("Oops! Something went wrong")
        }
    })
})