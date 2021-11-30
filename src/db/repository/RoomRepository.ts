import {RepositoryService} from "../../services/RepositoryService";
import {roomSchema} from "../models/RoomModel";

export class RoomRepository extends RepositoryService {
    constructor() {
        super("Rooms", roomSchema);
    }

    create(name: string, socketId: string, createdBy: string, isInConversation: boolean = false) {
        return this.save({
            name: name,
            socketId: socketId,
            isInConversation: isInConversation,
            createdBy: createdBy
        })
    }

    incrementNewMessageNumber(roomName:string){
        return this.Model.update({name:roomName},{$inc:{newMessages:1}})
    }

    setNewMessages(roomName:string,number:number=0){
        return this.Model.update({name:roomName},{newMessages:number});
    }

    setParticipants(roomName:string,number:number=0){
        return this.Model.update({name:roomName},{participants:number});
    }

    setImportantStatus(roomName:string,important:boolean){
        return this.Model.update({name:roomName},{isImportant:important})
    }

    setAssistanceNeededStatus(roomName:string,assistanceNeeded:boolean){
        return this.Model.update({name:roomName},{assistanceNeeded:assistanceNeeded})
    }

}
