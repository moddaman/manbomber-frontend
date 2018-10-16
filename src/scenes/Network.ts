import * as io from 'socket.io-client';

 const socket = io('https://manbomber.herokuapp.com');
//const socket = io('http://localhost:5000');


interface NetworkMsgPlay {
    name: string;
    x: number;
    y: number;
}

const randomName = () => {
    return 'oystein' + Math.round(Math.random() * 100);
};

const getWindowName = () => {
    let search = window.location.search;
    if (search && search.length > 1) {
        return search.substr(1)
    }
    return undefined;
};

class Network {
    networkCount: number;
    lastPlayerMsg: NetworkMsgPlay;

    currentEnemyPlayerMsg: NetworkMsgPlay;
    enemiesMap: {
        [id: number]: NetworkMsgPlay
    };


    constructor() {
        socket.on("player_update", (data) => {
            this.onPlayersUpdate(data);
        });
        this.networkCount = 0;
        console.log('name', window.location.search);
        this.lastPlayerMsg = {
            name: getWindowName() || randomName(),
            x: 0,
            y: 0
        };

        this.currentEnemyPlayerMsg = {
            name: 'inge her',
            x: 0, y: 0
        };
        this.enemiesMap = {};
    }


    create() {
        this.networkCount = 0;

    }

    isYou(newMsg: NetworkMsgPlay) {
        return newMsg.name != this.lastPlayerMsg.name
    }

    getIdForArraySpriteOrUndefined() {

    }

    isNewUnkownEnemy(newMsg: NetworkMsgPlay) {

        Object.keys(this.enemiesMap).forEach(key => {
            let value = this.enemiesMap[key];
            if (value && value.name === newMsg.name) {
                return true;
            }

        });

        return newMsg.name != this.lastPlayerMsg.name
    }

    onPlayersUpdate(newMsg: NetworkMsgPlay) {
        if (!this.isYou(newMsg)) return;


        this.enemiesMap[newMsg.name] = newMsg;

        console.log("Fiende bevegelse", newMsg);

        // Object.keys(this.enemiesMap).forEach(key => {
        //     let value = this.enemiesMap[key];
        //
        //
        // });


        this.currentEnemyPlayerMsg = newMsg;


    }

    update(time: number, player: Phaser.GameObjects.Sprite, enemies: Phaser.GameObjects.Sprite[]) {
        this.networkCount++;

        if (this.networkCount % 1 === 0) {
            // console.log('update', time);

            if (this.lastPlayerMsg.x != player.x || this.lastPlayerMsg.y != player.y) {

                const myPos: NetworkMsgPlay = {
                    name: this.lastPlayerMsg.name,
                    x: player.x,
                    y: player.y
                };
                this.lastPlayerMsg = myPos;
                socket.emit('player_update', myPos);
                console.log('sender ny socket siden endring', myPos);
            }

        }

        for (var i = 0; i < enemies.length; i++) {
            const enemySprite = enemies[i];
            let eMap = this.enemiesMap[i];
            if (eMap) {
                enemySprite.visible = true;
                enemySprite.x = eMap.x;
                enemySprite.y = eMap.y;
            }
        }

        //enemy.x = this.currentEnemyPlayerMsg.x;
        //enemy.y = this.currentEnemyPlayerMsg.y;

        //
    }
}

export default Network;