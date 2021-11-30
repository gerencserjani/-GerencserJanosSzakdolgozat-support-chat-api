import { typedModel } from "ts-mongoose";

export class RepositoryService {

    Model: any;

    constructor(private readonly COLLECTION_NAME: string, model: any) {
        this.Model = typedModel(this.COLLECTION_NAME, model);
    }

    async findOne(query: object) {
        return this.Model.findOne(query);
    }

    async find(query: object) {
        return this.Model.find(query);
    }

    async aggregate(query: object) {
        return this.Model.aggregate(query);
    }

    async remove(query: object) {
        return this.Model.remove(query)
    }

    async update(query: object, update: object) {
        return this.Model.update(query, {
            $set: update
        });
    }

    async save(query: object) {
        const result = new this.Model(query);
        return result.save();
    }

    async insertMany(query: object[]){
        this.Model.insertMany(
            query
        );
    }

}