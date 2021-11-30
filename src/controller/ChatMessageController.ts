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
import {UserRepository} from "../db/repository/UserRepository";
import "reflect-metadata";
import {ChatMessageRepository} from "../db/repository/ChatMessageRepository";
import {GridFsUploader, IGridFsInfo} from "../services/uploaders/GridFsUploader";
import {UploadGridfsService} from "../services/uploaders/UploaderGridfsService";


@Controller()
export class ChatMessageController{

    chatMessageRepository: ChatMessageRepository = new ChatMessageRepository();

    @Get('/chatmessage/:roomName')
    async getRoomMessageAndSortByTime(@Req() req: Request, @Res() res: Response,@Param('roomName') roomName:string){
        return  res.json(await this.chatMessageRepository.getRoomMessages(roomName)) ;
    }

    @Post('/chatmessage/:roomName')
    async uploadFile(@Req() req: any, @Res() res: Response) {
        if (!req?.files?.file) {
            return res.send("File not found");
        }

        const gridFsInfo: IGridFsInfo = await GridFsUploader.upload(req.files.file);
        console.log("gridFsInfo:  ",gridFsInfo)
        return gridFsInfo;
    }

    @Get("/chatmessage/:roomName/:id")
    async getFileInfo(@Req() req: any, @Res() res: Response, @Param("id") id: string): Promise<any> {
        return await UploadGridfsService.getFileInfo(id);
    }



}
