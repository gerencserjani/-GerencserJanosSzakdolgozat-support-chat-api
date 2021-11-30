import {Body, Controller, Post, Req, Res} from "routing-controllers";
import {Request, Response} from "express";
import {UserRepository} from "../db/repository/UserRepository";
import {BcryptService} from "../authentication-middlewares/BcryptService";
import {TokenService} from "../authentication-middlewares/TokenService";
import {userDOC} from "../db/models/UserModel";
import {isAlpha} from "class-validator";


@Controller()
export class LoginController {
    userRepository: UserRepository = new UserRepository()

    @Post('/login')
    async login(@Req() req: Request, @Res() res: Response, @Body() login: ILogin) {
        const user: userDOC = await this.userRepository.findOne({name: login.name})

        const isPassMatch = await BcryptService.isMatchHashPassword(req.body.password, user?.password || "")

        if (!isPassMatch) {
            res.status(401).send("Unauthorized")
        }

        const token = await TokenService.signAccessToken({roles: user.roles});

        return res.json({token: token, supportId: user._id});
    }
}

export interface ILogin {
    name: string;
    password: string;
}
