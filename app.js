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

client.on('message', (channel, tags, message, self) => {

    if (tags['display-name'].toLowerCase().endsWith('bot')){
        console.info('dropped user: '+tags['display-name']);
        return;
    }


    const words = message.split(' ');
    const wordsSet = new Set();
    words.reduce((_, e) => wordsSet.add(e), null);

    if (wordsSet.size < 3){
        console.info('worthless text: '+message);
        return;
    }
    var directedText = '';
    if (message.includes('@')){
        if (!message.toLowerCase().includes('@'+channelParam.toLowerCase())){
            console.info('message to someone else: '+message);
            return;
        } else {
            directedText = 'font-style: italic;';
        }
    }

    let filter = /POGGERS|LULW|LUL|KEKW|KappaClaus|KappaPride|PepeLaugh|Pog/gi;
    message = message.replace(filter, '');

    //message = message.toLowerCase();
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const messageValue = getScores(message);
    if (messageValue.readingTime < 1.0 || messageValue.automatedReadabilityIndex < 1.0 ){
        console.info('dropped low value message: ' + message);
        return;
    }

    const oldChatArray = chatElement.innerHTML.split('<br>');
    if (oldChatArray.length > 200) {
        oldChatArray.shift();
    }
    const oldChat = oldChatArray.join('<br>');

    chatElement.innerHTML = oldChat
        + '\r\n' 
        + '<p style="display:inline; color:' 
            + tags['color'] +'";><b>' 
            + tags['display-name'] 
        + ':</b></p> '
        + '<p style="display:inline;'+ directedText + '">'
        + message 
        + '</p>'
        + '<br>';
    window.scrollTo(0,document.body.scrollHeight);
})
