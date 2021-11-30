import {RepositoryService} from "../../services/RepositoryService";
import {chatMessageSchema} from "../models/ChatMessageModel";
import {IUser} from "../../controller/RegistrationController";
import {IMessage} from "../../utils/Utils";
import {IChatUser} from "../../services/UserService";

export class ChatMessageRepository extends RepositoryService {
    constructor() {
        super("ChatMessage", chatMessageSchema);
    }

    saveMessage(message: IMessage, user: IChatUser){
        const messageModel = {
            supportId: user.supportId,
            isSupport: user.isSupport,
            roomName: user.room,
            messages: message
        }
        return this.save(messageModel);
    }

    getRoomMessages(roomName:string){
        return this.find({roomName:roomName})
    }
}
