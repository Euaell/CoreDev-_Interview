import { Router } from 'express';
import ProjectController from '../controllers/ProjectController';
import Authenticate from "../middlewares/Authenticate"

const router = Router()

router.post("/", Authenticate.authenticate, ProjectController.createProject)

router.get("/", ProjectController.getProjects)
router.get("/myprojects", Authenticate.authenticate, ProjectController.getMyProjects)
router.get("/getTasks/:id", Authenticate.authenticate, ProjectController.getTasks)
router.get("/:id", Authenticate.authenticate, ProjectController.getProject)

router.put("/addTask/:id", Authenticate.authenticate, Authenticate.authorizeProject, ProjectController.assignTask)
router.put("/removeTask/:id", Authenticate.authenticate, Authenticate.authorizeProject, ProjectController.unassignTask)
router.put("/:id", Authenticate.authenticate, Authenticate.authorizeProject, ProjectController.updateProject)

router.delete("/:id", Authenticate.authenticate, Authenticate.authorizeProject, ProjectController.deleteProject)

export default router
