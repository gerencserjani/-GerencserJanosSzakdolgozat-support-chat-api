import mongoose from 'mongoose'
import {MyLogger} from "./Logger";
import {Server} from "./Server";

require('dotenv/config')


mongoose.connect(process.env.DB_URI as string, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    MyLogger.debug("connected to DB")
});
MyLogger.logger.level = process.env.LOGGER_LEVEL || "trace"


const server = Server.createApp();
