import {createSchema, ExtractDoc, Type} from "ts-mongoose";

export const roomSchema = createSchema({
    name: Type.string({required: true}),
    socketId: Type.string({required:true}),
    isInConversation: Type.boolean({required:true, default:false}),
    createdBy: Type.string({required:true,enum:["support","client"]}),
    createdAt: Type.date({default: new Date()}),
    isActive: Type.boolean({default:true}),
    newMessages: Type.number({default:0}),
    isImportant: Type.boolean({default:false}),
    assistanceNeeded: Type.boolean({default:false}),
    participants: Type.number({default:0}),
}, {strict: true});

export type projectDOC = ExtractDoc<typeof roomSchema>;

