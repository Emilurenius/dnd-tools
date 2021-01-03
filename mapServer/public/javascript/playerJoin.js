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
})