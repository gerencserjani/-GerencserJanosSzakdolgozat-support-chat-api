import {RepositoryService} from "../../services/RepositoryService";
import {userSchema} from "../models/UserModel";

export class UserRepository extends RepositoryService {
    constructor() {
        super("ChatUsers", userSchema);
    }

    findAvailableUsers(){
        return this.find({available:true});
    }
}
