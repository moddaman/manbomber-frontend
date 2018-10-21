declare var window;
import 'phaser';
import {socket, SOCKET_CHAT_KEY} from './network/socket';

export class Chat {
  constructor() {
    window.onSubmitForm = () => {
      Chat.sendMessage();
      return false;
    };

    socket.on(SOCKET_CHAT_KEY, Chat.onRecieve);
  }

  static onRecieve(msg: string) {
    const ul = document.getElementById("messages");
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(msg));
    ul.appendChild(li);

  }

  static sendMessage() {
    const input = document.getElementById("m") as HTMLInputElement;
    const message = input.value;
    input.value = '';

    socket.emit(SOCKET_CHAT_KEY, message);
  }
}

