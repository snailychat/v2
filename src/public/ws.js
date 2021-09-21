const ws_uri = `ws://${window.location.host}/`;
const ws = new WebSocket(ws_uri);

document.ws = ws;
ws.onopen = () => {
    document.back_connection = ws;
};
ws.onmessage = ({data}) => {
    const { username, content } = JSON.parse(data);
    document.addMessage(username, content, false);
}



function reset () {
    document.getElementById('chat-send').value = '';
}
document.reset = reset;
document.send = () => {
    const textare = document.getElementById('chat-send');
    let content = textare.value;
    content = content.split('\n').join('');
    if(!content) return reset();
    //if(!value || value == '') return;

    if(!document.username) ask();
    document.addMessage(document.username, content, true);

    console.log(document.username, content)
    document.ws.send(JSON.stringify({
        username: document.username,
        content
    }));
}
document.addEventListener('keydown', ({key}) => {
    if(key != 'Enter') return;
    document.send();
    /*const textare = document.getElementById('chat-send');
    let content = textare.value;
    content = content.split('\n').join('');
    if(!content) return reset();
    //if(!value || value == '') return;

    if(!document.username) ask();
    document.addMessage(document.username, content, true);

    console.log(document.username, content)
    ws.send(JSON.stringify({
        username: document.username,
        content
    }));*/

    reset();
});