function main() {
    const sendButton = document.getElementsByClassName("sendButton")[0]
    const inputField = document.getElementsByClassName("inputField")[0]
    const textContainer = document.getElementsByClassName("chatBox")[0]
    const chatBoxContainer = document.getElementById("chatBoxContainer")

    sendButton.addEventListener("click", (event) => {
        const addText = `You: ${inputField.value}\n`
        console.log(addText)
        const textElement = textFormat(addText)

        textContainer.appendChild(textElement)
        chatBoxContainer.scrollTo(0, document.body.scrollHeight)
    })
}

window.onload = () => {
    main()
}