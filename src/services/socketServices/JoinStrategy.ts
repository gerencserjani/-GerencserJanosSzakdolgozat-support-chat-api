import {Socket} from "socket.io";
import {IJoinRoom} from "./socketCommunication/RoomSockets";
import {RoomRepository} from "../../db/repository/RoomRepository";
import {Constants} from "../../utils/Constants";
import {Utils} from "../../utils/Utils";
import {UpdateSocket} from "./socketCommunication/UpdateSocket";
import {Server} from "../../Server";

export class JoinStrategy {
    constructor(private readonly roomRepository: RoomRepository) {
    }

    async joinUserToRoom(socket: Socket, joinRoomReq: IJoinRoom) {

        // client
        if (!joinRoomReq.isSupport) {
            return await this.createRoom('client', socket)
        }

        // support
        const waitingRoom = await this.roomRepository.findOne({isInConversation: false, createdBy: "client"});
        socket.join(waitingRoom.name);
        socket.emit(Constants.MESSAGE.SEND_MESSAGE, Utils.formatMessage(Constants.CHATBOT_NAME, 'Welcome to Support Live Chat'));
        await this.roomRepository.update({_id: waitingRoom._id}, {isInConversation: true});
        const roomRepo : RoomRepository = new RoomRepository();
        await roomRepo.setParticipants(joinRoomReq.room,await Server.io.in(joinRoomReq.room).allSockets().size);
        UpdateSocket.sendUpdate();
        return waitingRoom.name

    }


    async createRoom(createdBy: "client", socket: Socket): Promise<string> {
        await this.roomRepository.create(socket.id, socket.id, createdBy);
        UpdateSocket.sendUpdate();
        socket.join(socket.id);
        if(createdBy=="client"){
            socket.emit(Constants.MESSAGE.SEND_MESSAGE, Utils.formatMessage(Constants.CHATBOT_NAME, 'Welcome to support chat. Let me know if I can help you '));
        }
        return socket.id
    }
}
