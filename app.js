const chatElement = document.querySelector('#chat');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const channelParam = urlParams.get('channel');
console.log(channelParam);


const client = new tmi.Client({
    connction: {reconnect: true},
    channels: [channelParam],
});

client.connect();

// ---- small helper to make URLs clickable ----
function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, url =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
}

client.on('message', (channel, tags, message, self) => {

    // check if message has a URL
    const hasLink = /(https?:\/\/[^\s]+)/i.test(message);

    // check if message is from the streamer
    const isStreamer = tags['display-name'] && tags['display-name'].toLowerCase() === channelParam.toLowerCase();

    // immune messages bypass all filters
    const immune = hasLink || isStreamer;

    // drop bots (unless immune)
    if (!immune && tags['display-name'].toLowerCase().endsWith('bot')){
        console.info('dropped user: '+tags['display-name']);
        return;
    }

    // excessive repeat (unless immune)
    if (!immune) {
        const repeatSplit = message.split(message.substr(0,8));
        if (repeatSplit.length > 3) {
            console.info('deleted excessive repeat: '+message);
            return;
        }
    }

    // worthless short messages (unless immune)
    if (!immune) {
        const words = message.split(' ');
        const wordsSet = new Set();
        words.reduce((_, e) => wordsSet.add(e), null);
        if (wordsSet.size < 4){
            console.info('worthless text: '+message);
            return;
        }
    }

    // directed messages (@username)
    var directedText = '';
    if (message.includes('@')){
        if (!message.toLowerCase().includes('@'+channelParam.toLowerCase())){
            console.info('message to someone else: '+message);
            return;
        } else {
            directedText = 'font-style: italic;';
        }
    }

    // emote filtering (unless immune)
    if (!immune) {
        let filter = /POGGERS|LULW|LUL|KEKW|KappaClaus|KappaPride|PepeLaugh|Pog|OMEGA|OMEGALOL|monkaW/gi;
        message = message.replace(filter, '');
    }

    // escape HTML
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // make URLs clickable
    message = linkify(message);

    // readability score (unless immune)
    if (!immune) {
        const messageValue = getScores(message);
        if (messageValue.readingTime < 1.0 || messageValue.automatedReadabilityIndex < 1.0 ){
            console.info('dropped low value message: ' + message);
            return;
        }
    }

    const oldChatArray = chatElement.innerHTML.split('<br>');
    if (oldChatArray.length > 200) {
        oldChatArray.shift();
    }
    const oldChat = oldChatArray.join('<br>');

    // Highlight if sender is the channel owner
    const highlightStyle = isStreamer ? 'background-color: #fff3a0; padding: 4px 6px; border-radius: 4px;' : '';
    const nameColor = tags['color'] || '#ffffff';

    chatElement.innerHTML = oldChat
        + '\r\n'
        + `<div style="${highlightStyle}">`
        + '<p style="display:inline; color:' 
            + nameColor +'";><b>' 
            + tags['display-name'] 
        + ':</b></p> '
        + '<p style="display:inline;'+ directedText + '">'
        + message 
        + '</p>'
        + '</div>'
        + '<br>';

    window.scrollTo(0,document.body.scrollHeight);
});
