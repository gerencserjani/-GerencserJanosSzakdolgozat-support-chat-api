import {Socket} from "socket.io";
import {IChatUser, UserService} from "../../UserService";
import {ConnectionSockets} from "./ConnectionSockets";
import {Server} from "../../../Server";
import {Constants} from "../../../utils/Constants";
import {RoomRepository} from "../../../db/repository/RoomRepository";
import {JoinStrategy} from "../JoinStrategy";
import {MessageSockets} from "./MessageSockets";
import {UpdateSocket} from "./UpdateSocket";


export class RoomSockets {
    constructor() {
    }

    static async joinRoom(socket: Socket) {
        socket.on(Constants.JOIN_ROOM, async (joinRoomReq: IJoinRoom) => {
            let room;

            let clients = await Server.io.in(joinRoomReq.room).allSockets()
            if ((clients.has(socket.id))) {
                return
            }
            if (joinRoomReq.room) {
                room = joinRoomReq.room
                socket.join(room);

            } else {
                const joinStrategy1 = new JoinStrategy(new RoomRepository());
                room = await joinStrategy1.joinUserToRoom(socket, joinRoomReq);
            }
            const user = UserService.joinUser(socket.id, joinRoomReq.username, room, joinRoomReq.isSupport, joinRoomReq.supportId)

            RoomSockets.updateRoomUsers(user)
            ConnectionSockets.connect(socket, user);
            ConnectionSockets.disconnect(socket, user);

            MessageSockets.chatMessage(socket);
            const roomRepo : RoomRepository = new RoomRepository();
            await roomRepo.setNewMessages(joinRoomReq.room);
            const resultSocketNumber = await Server.io.in(room).allSockets();
            await roomRepo.setParticipants(room,resultSocketNumber.size);
            UpdateSocket.sendUpdate();
        })
    }

    static updateRoomUsers(user: IChatUser) {
        Server.io.to(user.room).emit(Constants.ROOM_USERS, {
            room: user.room,
            users: UserService.getRoomUsers(user.room)
        })
    }
}

export interface IJoinRoom {
    username: string;
    isSupport: boolean;
    room: string;
    supportId?: string;
}
