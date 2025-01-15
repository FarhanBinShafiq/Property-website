// Add the chatbot to the DOM when the page loads
window.onload = function () {
    // Create the modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    document.body.appendChild(modalOverlay);

    // Create the toggle button
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggleButton";
    toggleButton.textContent = "Open Chatbot";
    document.body.appendChild(toggleButton);

    // Create the chat container
    const chatContainer = document.createElement("div");
    chatContainer.id = "chatContainer";
    chatContainer.style.display = "none"; // Initially hidden

    // Create the chat header
    const chatHeader = document.createElement("div");
    chatHeader.className = "chat-header";
    chatHeader.textContent = "Chatbot";

    const closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.textContent = "×";
    closeButton.onclick = closeChat;
    chatHeader.appendChild(closeButton);

    chatContainer.appendChild(chatHeader);

    // Create the chat messages area
    const chatMessages = document.createElement("div");
    chatMessages.id = "chatMessages";
    chatMessages.className = "chat-messages";
    chatContainer.appendChild(chatMessages);

    // Create the chat input area
    const chatInput = document.createElement("div");
    chatInput.className = "chat-input";

    const inputField = document.createElement("input");
    inputField.id = "userMessage";
    inputField.type = "text";
    inputField.placeholder = "Type a message...";
    inputField.onkeydown = checkEnter;

    const sendButton = document.createElement("button");
    sendButton.textContent = "Send";
    sendButton.onclick = sendMessage;

    chatInput.appendChild(inputField);
    chatInput.appendChild(sendButton);
    chatContainer.appendChild(chatInput);

    document.body.appendChild(chatContainer);

    // Attach event listeners for toggling chatbot
    toggleButton.onclick = function () {
        const isCurrentlyOpen = chatContainer.style.display === "block";
        if (isCurrentlyOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    // Function to open the chat (display the modal and overlay)
    function openChat() {
        chatContainer.style.display = "block";
        modalOverlay.style.display = "block";
        setTimeout(() => {
            chatContainer.style.opacity = "1";
            modalOverlay.style.opacity = "1";
        }, 10);
        toggleButton.textContent = "Close Chatbot";
        localStorage.setItem("isChatOpen", "true");
    }

    // Function to close the chat (hide the modal and overlay)
    function closeChat() {
        chatContainer.style.opacity = "0";
        modalOverlay.style.opacity = "0";
        setTimeout(() => {
            chatContainer.style.display = "none";
            modalOverlay.style.display = "none";
        }, 300);
        toggleButton.textContent = "Open Chatbot";
        localStorage.setItem("isChatOpen", "false");
    }

    // Check the local storage to remember the chatbot's state
    const isChatOpen = localStorage.getItem("isChatOpen") === "true";
    if (isChatOpen) {
        openChat();
    }
};

// Function to send the message
async function sendMessage() {
    const userMessage = document.getElementById("userMessage").value;
    const chatMessages = document.getElementById("chatMessages");

    if (userMessage.trim() === "") return;

    // Append user's message to chat
    appendMessage(userMessage, "user");

    // Sending the message to Flask backend for search
    const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    // Check if the response contains text
    if (data.text) {
        appendMessage(data.text, "bot");
    }

    // Check if the response contains an image
    if (data.image) {
        appendImage(data.image, "bot");
    }

    // Clear the input field after sending
    document.getElementById("userMessage").value = "";
}

// Function to append messages to chat
function appendMessage(message, sender) {
    const chatMessages = document.getElementById("chatMessages");
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.classList.add(sender);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to append an image to chat
function appendImage(imageUrl, sender) {
    const chatMessages = document.getElementById("chatMessages");
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    imageElement.classList.add(sender);
    chatMessages.appendChild(imageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to check if Enter key is pressed
function checkEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
