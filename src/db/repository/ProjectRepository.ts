import {RepositoryService} from "../../services/RepositoryService";
import {projectSchema} from "../models/ProjectModel";

export class ProjectRepository extends RepositoryService {
    constructor() {
       super("ChatProjects", projectSchema);
   }
}
