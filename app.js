const chatElement = document.querySelector('#chat');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channelParam = urlParams.get('channel');
console.log(channelParam);


const client = new tmi.Client({
    cconnection: { reconnect: true }
    channels: [channelParam],
});

client.connect();

client.on('message', (channel, tags, message, self) => {

    // drop bots
    if (tags['display-name'].toLowerCase().endsWith('bot'))
        return;

    // excessive repeat
    if (/^(.{1,8})\1\1/.test(message))
        return console.info('deleted excessive repeat:', message);

    // worthless short messages
    const words = new Set(message.split(' '));
    if (words.size < 4)
        return;

    // directed messages (@username)
    let directedText = "";
    if (message.includes("@")) {
        if (!message.toLowerCase().includes("@" + channelParam.toLowerCase()))
            return;

        directedText = "font-style: italic;";
    }

    // emote filtering
    const bannedWords = new Set([
        "POGGERS","LULW","LUL","KEKW",
        "KappaClaus","KappaPride","PepeLaugh",
        "Pog","OMEGA","OMEGALOL","monkaW"
    ]);

    message = message
        .split(" ")
        .filter(w => !bannedWords.has(w.toUpperCase()))
        .join(" ");

    // escape HTML
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // clickable links
    message = linkify(message);

    // AI readability scoring
    const messageValue = getScores(message);
    if (messageValue.readingTime < 1.0 || messageValue.automatedReadabilityIndex < 1.0)
        return;

    // ⭐ Highlight if sender is the channel owner
    let highlightStyle = "";
    if (tags['display-name'].toLowerCase() === channelParam.toLowerCase()) {
        highlightStyle = "background-color: #fff3a0; padding: 4px 6px; border-radius: 4px;";
    }

    // append new message
    const entry = document.createElement("div");
    entry.setAttribute("style", highlightStyle);

    entry.innerHTML = `
        <p style="display:inline; color:${tags.color};"><b>${tags['display-name']}:</b></p>
        <p style="display:inline; ${directedText}">${message}</p>
    `;

    chatElement.appendChild(entry);

    // keep only last 200 messages
    while (chatElement.children.length > 200)
        chatElement.removeChild(chatElement.firstChild);

    window.scrollTo(0, document.body.scrollHeight);
});


// ⭐ Handle pinned messages (USERNOTICE)
client.on("usernotice", (channel, tags, msg) => {
    if (tags["msg-id"] === "pinned-chat") {
        const pin = document.createElement("div");
        pin.innerHTML = `
            <p style="color: gold; font-weight:bold;">
                📌 PINNED — ${tags['display-name']}: ${msg}
            </p>
        `;
        chatElement.appendChild(pin);
    }
});


// Helper for clickable URLs
function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
}

