import express, {Express} from "express";
import bodyParser from "body-parser";
import {RepositoryService} from "./services/RepositoryService";
import {useExpressServer} from "routing-controllers";
import {RegistrationController} from "./controller/RegistrationController";
import {MyLogger} from "./Logger";
import * as mongoose from "mongoose";
import {SocketService} from "./services/socketServices/SocketService";
import {AuthenticationMiddlewares} from "./authentication-middlewares/AuthenticationMiddlewares";
import {LoginController} from "./controller/LoginController";
import {UserController} from "./controller/UserController";
import {RoomController} from "./controller/RoomController";
import {ChatMessageController} from "./controller/ChatMessageController";
import {RoomRepository} from "./db/repository/RoomRepository";
import {Utils} from "./utils/Utils";
import {UploadGridfsService} from "./services/uploaders/UploaderGridfsService";
const fileUpload = require("express-fileupload");

require('dotenv/config');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const http = require('http');

export class Server {
    static io: any;

    constructor() {
    }

    static createApp() {
        const app = express();


        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());
        app.use(fileUpload())
        this.setup(app)

        // auth

        AuthenticationMiddlewares.setup({
            jwtSecret: 'secret',
            isBearer: true, // your token starts with "bearer xx.yy.zz"
            tokenPath: 'token' // token location in header req.headers[tokenPath]
        });

        app.use(AuthenticationMiddlewares.authenticationMiddleware());

        useExpressServer(app, {
            defaults: {
                nullResultCode: 404,
                undefinedResultCode: 204,
            },
            cors: {
                methods: ["GET", "POST", "PUT", "DELETE"]
            },
            classTransformer: true,
            controllers: [RegistrationController, LoginController, UserController, RoomController, ChatMessageController]
        });

        const server = http.createServer(app)
        Server.io = socketio(server, {
            cors: {
                origin: '*',
            }
        });

        server.listen(3000, () => {
             MyLogger.debug("App listening on port " + 3000);
         });

        SocketService.setup();
        const roomRepo: RoomRepository = new RoomRepository();
        roomRepo.remove({});

        return server;
    }

    static setup(app: Express): any {
        app.get("/api/assets/:id", async (req: any, res: any) => {
            const disposition: "attachment" | "inline" = req.query.disposition || "inline";

            const gfs: any = await UploadGridfsService.getGfs();
            const ObjectId = require("mongodb").ObjectId;
            gfs.files.findOne(ObjectId(req.params.id), (err: any, file: any) => {
                if (!file || file.length === 0) {
                    return res.notFound();
                }

                if (disposition === "inline") {
                    if (Utils.getPathExtension(file.filename) === "pdf") {
                        res.contentType("application/pdf");
                    } else {
                        res.contentType(file.contentType);
                    }
                } else if (disposition === "attachment") {
                    res.set("Content-Type", file.contentType);
                    res.set("Content-Disposition", 'attachment; filename="' + file.filename + '"');
                }

                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            });
        });
    }

}
