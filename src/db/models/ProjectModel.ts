import {createSchema, ExtractDoc, Type} from "ts-mongoose";

export const projectSchema = createSchema({
    name: Type.string({required: true}),
}, {strict: true});

export type projectDOC = ExtractDoc<typeof projectSchema>;

