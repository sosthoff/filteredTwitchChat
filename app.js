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
    const words = message.split(' ');
    const wordsSet = new Set();
    words.reduce((_, e) => wordsSet.add(e), null);
    

    if (wordsSet.size < 3){
        console.log('worthless text: '+message);
        return;
    }
    var directedText = '';
    if (message.includes('@')){
        if (!message.toLowerCase().includes('@'+channelParam.toLowerCase())){
            console.log('message to someone else: '+message);
            return;
        } else {
            directedText = 'font-style: italic;';
        }
    }

    let filter = /POGGERS|LULW|LUL|KEKW|KappaClaus|KappaPride|PepeLaugh|Pog/gi;
    message = message.replace(filter, '');

    //message = message.toLowerCase();
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    chatElement.innerHTML += '\r\n' 
        + '<p style="display:inline; color:' 
            + tags['color'] +'";><b>' 
            + tags['display-name'] 
        + ':</b></p> '
        + '<p style="display:inline;'+ directedText + '">'
        + message 
        + '</p>'
        + '\r\n';
    window.scrollTo(0,document.body.scrollHeight);
})
