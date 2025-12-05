const chatElement = document.querySelector('#chat');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channelParam = urlParams.get('channel');
console.log(channelParam);


const client = new tmi.Client({
    connection: {reconnect: true},
    channels: [channelParam],
});

client.connect();

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
}

client.on('message', (channel, tags, message, self) => {

    if (!chatElement) {
        console.error("chatElement missing!");
        return;
    }

    // drop bots
    if (tags['display-name']?.toLowerCase().endsWith('bot'))
        return;

    // excessive repeat check
    if (/^(.{1,8})\1\1/.test(message))
        return;

    // worthless short messages
    const words = new Set(message.split(' '));
    if (words.size < 4)
        return;

    let directedText = "";
    if (message.includes("@")) {
        if (!message.toLowerCase().includes("@" + channelParam.toLowerCase()))
            return;

        directedText = "font-style: italic;";
    }

    // emote filtering
    const bannedWords = new Set(["POGGERS","LULW","LUL","KEKW","KappaClaus","KappaPride","PepeLaugh","Pog","OMEGA","OMEGALOL","monkaW"]);
    message = message
        .split(" ")
        .filter(w => !bannedWords.has(w.toUpperCase()))
        .join(" ");

    // escape HTML
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // clickable URLs
    message = linkify(message);

    // safe getScores
    let messageValue;
    try {
        messageValue = getScores(message);
    } catch (e) {
        console.error("getScores error:", e);
        return;
    }

    if (!messageValue || messageValue.readingTime < 1.0 || messageValue.automatedReadabilityIndex < 1.0)
        return;

    // ⭐ name color fallback fix
    const nameColor = tags.color || "#ffffff";

    const entry = document.createElement("div");
    entry.innerHTML = `
        <p style="display:inline; color:${nameColor};"><b>${tags['display-name']}:</b></p>
        <p style="display:inline; ${directedText}">${message}</p>
    `;
    chatElement.appendChild(entry);

    // trim
    while (chatElement.children.length > 200)
        chatElement.removeChild(chatElement.firstChild);

    window.scrollTo(0, document.body.scrollHeight);
});
