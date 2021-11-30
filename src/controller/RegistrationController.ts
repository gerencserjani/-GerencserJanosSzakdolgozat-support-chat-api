import {
    Body,
    BodyParam,
    Controller,
    Delete,
    Get,
    Middleware,
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
import {AuthenticationMiddlewares} from "../authentication-middlewares/AuthenticationMiddlewares";


@Controller()
export class RegistrationController {
    userRepository: UserRepository = new UserRepository()

    @Post('/registration')
    @UseBefore(AuthenticationMiddlewares.passwordBcryptMiddleware('password', 'bcryptedPassword'))
    async registration( @Req() req: any, @Res() res: Response, @Body() user: IUser) {
        user.password = req.bcryptedPassword;

        console.log(user)
        return res.json(await this.userRepository.save(user));
    }
}

export interface IUser{
    name: string;
    roles: string[];
    password: string;
    available?: string;
}
