const campaign = document.getElementById("campaignName")
const campaignName = window.location.search.split("&")[1].split("=")[1]
campaign.value = campaignName