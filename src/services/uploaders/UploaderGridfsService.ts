import stream from "stream";
import Grid from "gridfs-stream";
import mongoose from "mongoose";

export class UploadGridfsService {

    static getGfs(): Promise<Grid.Grid> {
        return new Promise(async (resolve, reject) => {
            const mongoURI = process.env.DB_URI;
            if (!mongoURI) {
                throw new Error("mongoUri is undefined");
            }
            const conn = mongoose.createConnection(mongoURI);

            // Init gfs
            let gfs: Grid.Grid;
            conn.once("open", () => {
                // Init stream
                gfs = Grid(conn.db, mongoose.mongo);
                gfs.collection("fs");
                resolve(gfs);
            });
        });
    }

    static getAllFiles() {
        return new Promise(async (resolve, reject) => {
            const gfs: Grid.Grid = await UploadGridfsService.getGfs();
            gfs.files.find().toArray((err: Error, files: any) => {
                // Check if files
                if (!files || files.length === 0) {
                    resolve("files not found");
                } else {
                    files.map((file: any) => {
                        if (
                            file.contentType === "audio/webm"
                        ) {
                            file.isAudio = true;
                        } else {
                            file.isAudio = false;
                        }
                    });

                    const res = JSON.parse(JSON.stringify(files));
                    resolve(res);
                }
            });
        });
    }

    static getFileInfo(id: string) {
        return new Promise(async (resolve, reject) => {
            const gfs: Grid.Grid = await UploadGridfsService.getGfs();
            const ObjectId = require("mongodb").ObjectId;
            gfs.files.findOne(ObjectId(id)).then((file: any) => {

                const res = JSON.parse(JSON.stringify(file));
                resolve(res);
            });
        });
    }

    static async upload(file: any) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const bufferStream = new stream.PassThrough();
                bufferStream.end(file.data);
                const gfs: any = await UploadGridfsService.getGfs();
                console.log(file.name)
                const writeStream = gfs.createWriteStream({
                    filename: file.name,
                    contentType: file.mimetype
                });
                const s = bufferStream.pipe(writeStream);

                s.on("finish", () => {
                    resolve(writeStream.id.toString());
                });

            } catch (err) {
                reject(`${file.name} upload failed`);
            }
        });
    }
}
