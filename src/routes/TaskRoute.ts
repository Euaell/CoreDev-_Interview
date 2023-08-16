import { Router } from 'express';
import TaskController from '../controllers/TaskController';
import Authenticate from "../middlewares/Authenticate"

const router = Router()

router.post("/", Authenticate.authenticate, TaskController.createTask)
router.get("/", Authenticate.authenticate, TaskController.getTasks)
router.get("/mytasks", Authenticate.authenticate, TaskController.getMyTasks)
router.get("/assigened", Authenticate.authenticate, TaskController.getAssignedTasks)
router.get("/:id", Authenticate.authenticate, TaskController.getTask)
router.put("/:id", Authenticate.authenticate, Authenticate.authorizeTask, TaskController.updateTask)
router.delete("/:id", Authenticate.authenticate, Authenticate.authorizeTask, TaskController.deleteTask)

export default router
