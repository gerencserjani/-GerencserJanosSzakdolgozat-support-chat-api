import {IMessage} from "../../../utils/Utils";
import {Server} from "../../../Server";
import {Constants} from "../../../utils/Constants";


export class UpdateSocket{

    static sendUpdate(){
        Server.io.emit("newRoom","new room created");
    }
}
