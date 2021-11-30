import {Socket} from "socket.io";
import {Utils} from "../../../utils/Utils";
import {Constants} from "../../../utils/Constants";
import {MyLogger} from "../../../Logger";
import {Server} from "../../../Server";
import {IChatUser, UserService} from "../../UserService";
import {levels} from "log4js";
import {RoomSockets} from "./RoomSockets";
import {MessageSockets} from "./MessageSockets";
import {RoomRepository} from "../../../db/repository/RoomRepository";
import {UpdateSocket} from "./UpdateSocket";

export class ConnectionSockets {
    constructor() {
    }

    static connect(socket: Socket, user: IChatUser) {
        MyLogger.trace("client connected");
    }

    static disconnect(socket: Socket, user: IChatUser) {
        socket.on('disconnect', async () => {
            if(!user.isSupport){
                const roomRepo = new RoomRepository();
                await roomRepo.remove({name: user.room})
                await MessageSockets.sendMessageToRoom(user.room, Utils.formatMessage(Constants.CHATBOT_NAME, user.username + ' has left the chat'));
            }

            MyLogger.trace(user.username + ' has left the chat')
            Server.io.to(user.room).emit('leaveUser', user);
            UserService.leaveUser(user.socketId);
            const resultSocketNumber = await Server.io.in(user.room).allSockets();
            const roomRepo : RoomRepository = new RoomRepository();
            await roomRepo.setParticipants(user.room,resultSocketNumber.size);
            UpdateSocket.sendUpdate();
            RoomSockets.updateRoomUsers(user)

        });
    }


}
