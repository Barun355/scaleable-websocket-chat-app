import { Server } from "socket.io"
import Redis from "ioredis";
import { channel } from "diagnostics_channel";


const pub = new Redis({
    host: 'redis-223dbc2e-scalable-socket-01-chat.a.aivencloud.com',
    port: 25460,
    username: 'default',
    password: 'AVNS_My9im8rV9Y-OIrHTVe9'
});
const sub = new Redis({
    host: 'redis-223dbc2e-scalable-socket-01-chat.a.aivencloud.com',
    port: 25460,
    username: 'default',
    password: 'AVNS_My9im8rV9Y-OIrHTVe9'
});

class SocketService{
    private _io: Server;

    constructor(){
        console.log("Init Socket Service...")
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
        sub.subscribe('MESSAGES')
    }

    get io(){
        return this._io
    }

    public initListener(){

        const io = this.io;
        console.log("Init Socket listeners");
        io.on("connect", socket => {
            console.log(`New Socket ${socket.id}`);

            socket.on("event:message", async ({message}: {message: string}) => {
                console.log(`New Event Recieved ${message}`);
                if (message){
                    await pub.publish("MESSAGES", JSON.stringify({message}))
                    // io.emit('redis:message', JSON.stringify({message}))
                }
            })
        })

        sub.on('message', (channel, message) => {
            console.log('Redis Sub', channel, message)
            if(channel == 'MESSAGES'){
                io.emit("redis:message", message)
            }
        })
    }
}

export default SocketService;