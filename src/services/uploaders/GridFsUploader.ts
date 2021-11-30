import {Utils} from "../../utils/Utils";
import {UploadGridfsService} from "./UploaderGridfsService";

export class GridFsUploader {
    static async upload(file: File): Promise<IGridFsInfo> {
        const gridFsId = await UploadGridfsService.upload(file);
        return {
            gridFsId,
            filename: file.name,
            size: file.size,
            extension: Utils.getPathExtension(file.name),
            contentType: (file as any).mimetype
        };
    }
}

export interface IGridFsInfo {
    gridFsId: string;
    filename: string;
    size: number;
    extension: string;
    contentType: string;
}
