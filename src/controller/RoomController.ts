import {
    Body,
    BodyParam,
    Controller,
    Delete,
    Get,
    Middleware, Param,
    Post,
    Put,
    Req,
    Res,
    UseBefore
} from "routing-controllers";
import {Request, Response} from "express";
import {RepositoryService} from "../services/RepositoryService";
import "reflect-metadata";
import {RoomRepository} from "../db/repository/RoomRepository";
import {MessageSockets} from "../services/socketServices/socketCommunication/MessageSockets";
import {Utils} from "../utils/Utils";
import {Constants} from "../utils/Constants";
import {UpdateSocket} from "../services/socketServices/socketCommunication/UpdateSocket";
import {AuthenticationMiddlewares} from "../authentication-middlewares/AuthenticationMiddlewares";



@Controller()
export class RoomController{

    roomRepository = new RoomRepository();

    @Get('/rooms')
    @UseBefore(AuthenticationMiddlewares.authorisationMiddleware("support"))
    async getAllRooms(@Req() req:any, @Res() res:Response){
        return res.json(await this.roomRepository.find({isActive:true}))
    }

    @Put('/rooms/:socketId')
    @UseBefore(AuthenticationMiddlewares.authorisationMiddleware("support"))
    async updateRoomsBySocketId(@Req() req:any, @Res() res:Response, @Param('socketId') socketId:string){
        await MessageSockets.sendMessageToRoom(socketId, Utils.formatMessage(Constants.CHATBOT_NAME, ' The room had been closed!'));
        return res.json(await this.roomRepository.update({socketId:socketId},req.body));
    }

    @Put('/importantRooms/:socketId')
    @UseBefore(AuthenticationMiddlewares.authorisationMiddleware("support"))
    async updateRoomImportance(@Req() req:any, @Res() res:Response, @Param('socketId') socketId:string){
        const result = await this.roomRepository.setImportantStatus(socketId,req.body.isImportant);
        UpdateSocket.sendUpdate();
        return res.json(result);
    }

    @Put('/assistanceRooms/:socketId')
    @UseBefore(AuthenticationMiddlewares.authorisationMiddleware("support"))
    async updateRoomAssistance(@Req() req:any, @Res() res:Response, @Param('socketId') socketId:string){
        const result = await this.roomRepository.setAssistanceNeededStatus(socketId,req.body.assistanceNeeded);
        UpdateSocket.sendUpdate();
        return res.json(result);
    }

}
