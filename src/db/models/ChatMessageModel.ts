import {createSchema, ExtractDoc, Type} from "ts-mongoose";


export const chatMessageSchema = createSchema({
    supportId: Type.string({required: false}),
    isSupport: Type.boolean({required: true}),
    roomName: Type.string({required: true}),
    messages: Type.object({required:true}).of({
        username:Type.string({required: false}),
        text: Type.string({required: false}),
        audioId: Type.string({required:false}),
        date: Type.date({required:true}),
    }),
}, {strict: true});

export type chatDOC = ExtractDoc<typeof chatMessageSchema>;

