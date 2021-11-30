import {createSchema, ExtractDoc, Type} from "ts-mongoose";

export const userSchema = createSchema({
    name: Type.string({required: true}),
    password: Type.string({required: true}),
    roles: Type.array({ required: true }).of(Type.string({ required: true, default: "support" })),
    available: Type.boolean({required: true, default: false}),
}, {strict: true});

export type userDOC = ExtractDoc<typeof userSchema>;


