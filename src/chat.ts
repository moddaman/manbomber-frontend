declare var window;
import 'phaser';
import {getUrlParam, socket, SOCKET_CHAT_KEY, SOCKET_SEND_CHAT_KEY} from './network/socket';

interface NetworkMsg {
  message: string;
  name: string;
}

export class Chat {
  constructor() {
    window.onSubmitForm = () => {
      Chat.sendMessage();
      return false;
    };

    socket.on(SOCKET_CHAT_KEY, Chat.onRecieve);
  }

  static onRecieve(msg: NetworkMsg) {
    const ul = document.getElementById("messages");
    const li = document.createElement("li");

    let text = `${msg.name}: ${msg.message}`;
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);

    console.log("mottok", msg);
  }

  static sendMessage() {
    const input = document.getElementById("m") as HTMLInputElement;
    const message = input.value;
    input.value = '';

    console.log("send beskjed", message);
    const msg: NetworkMsg = {
      message,
      name: getUrlParam('player')
    };
    socket.emit(SOCKET_SEND_CHAT_KEY, msg);
  }
}

