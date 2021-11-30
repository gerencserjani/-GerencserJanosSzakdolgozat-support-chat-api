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

@Controller()
export class UserController {

    userRepository: UserRepository = new UserRepository()

    @Post('/users/:id')
    async updateUserById(@Req() req: any, @Param("id") id: string, @Res() res: Response, @BodyParam("isAvailable") isAvailable: boolean){
            await this.userRepository.update({name: id}, {available: isAvailable})
    }

    @Get('/users')
    async getUsersIfAvailable(@Req() req:any, @Res() res:Response){
        return res.json(await this.userRepository.findAvailableUsers())
    }
}
