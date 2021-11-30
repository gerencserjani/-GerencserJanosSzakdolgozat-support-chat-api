export class Utils {

    static getPathExtension(path: string): string {
        return path.split(".")[path.split(".").length - 1] || "unknown";
    }


    static isValidObjectId(id: string) {
        return id.match(/^[0-9a-fA-F]{24}$/);
    }

    static pathClearSlash(path: string) {
        return path.replace(/^\/|\/$/g, "");
    }

    static pathToArray(path?: string) {
        if (!path || path === "/") {
            return [];
        }
        const cPath = this.pathClearSlash(path);
        return cPath.split("/");
    }

    static formatMessage(username: string, text: string, audioId?:string): IMessage {
        return {
            username: username,
            text: text,
            audioId: audioId,
            time: new Date()
        }
    }

}

export interface IMessage {
    username: string,
    text: string,
    audioId?: string,
    time: Date;
}


