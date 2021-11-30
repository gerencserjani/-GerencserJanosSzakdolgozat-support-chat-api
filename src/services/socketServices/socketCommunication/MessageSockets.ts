import {Socket} from "socket.io";
import {Server} from "../../../Server";
import {Utils, IMessage} from "../../../utils/Utils";
import {UserService} from "../../UserService";
import {Constants} from "../../../utils/Constants";
import {ChatMessageRepository} from "../../../db/repository/ChatMessageRepository";
import {RoomRepository} from "../../../db/repository/RoomRepository";
import {UpdateSocket} from "./UpdateSocket";

export interface ISentMessage{
    text:string,
    audioId?:string
}


export class MessageSockets {
    constructor() {
    }

    static chatMessage(socket: Socket) {
        socket.on(Constants.MESSAGE.MESSAGE_LISTENER, async (msg:ISentMessage) => {
            const user = UserService.getUserById(socket.id)
            if (!user) {
                console.log("user not found");
                return;
            }
            await MessageSockets.sendMessageToRoom(user.room, Utils.formatMessage(user.username, msg.text,msg.audioId));
            const messageRepository = new ChatMessageRepository();
            await messageRepository.saveMessage(Utils.formatMessage(user.username, msg.text,msg.audioId), user);
        })
    }

    static async sendMessageToRoom(room: string, message: IMessage){
        Server.io.to(room).emit(Constants.MESSAGE.SEND_MESSAGE, message);
        let clients = await Server.io.in(room).allSockets()
        if(clients.size<=1){
            const roomRep: RoomRepository = new RoomRepository();
            await roomRep.incrementNewMessageNumber(room);
            UpdateSocket.sendUpdate();
        }
    }
}
