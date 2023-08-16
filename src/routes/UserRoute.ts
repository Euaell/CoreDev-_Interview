import { Router } from "express"
import UserController from "../controllers/UserController"
import Authenticate from "../middlewares/Authenticate";

const router = Router()

router.get("/", UserController.getUsers)
router.get("/me", Authenticate.authenticate, UserController.getMe)
router.get("/:id", UserController.getUser)
router.post("/", UserController.createUser)

router.post("/login", UserController.loginUser)
router.get("/logout", Authenticate.authenticate, UserController.logoutUser)

router.put("/update", Authenticate.authenticate, UserController.updateUser)
router.delete("/delete", Authenticate.authenticate, UserController.deleteUser)

export default router
