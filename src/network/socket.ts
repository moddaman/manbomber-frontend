import * as io from 'socket.io-client';

//http://localhost:3000/?player=1&env=local
export const getUrlParam = (key: string) => {
  return new URLSearchParams(window.location.search.slice(1)).get(key)
};

const getDomain = () => {
  if (getUrlParam('env') === 'local') {
    return 'http://localhost:5000';
  } else {
    return 'https://manbomber.herokuapp.com';
  }
};

const socket = io(getDomain());
export {socket};


export const SOCKET_CHAT_KEY = 'chat message';
export const SOCKET_SEND_CHAT_KEY = 'new_chat_message';
export const PLAYER_UPDATE_KEY = "player_update";
export const BOMB_UPDATE_KEY = "bomb_update";
