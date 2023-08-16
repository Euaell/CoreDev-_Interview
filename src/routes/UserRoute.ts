import { Router } from "express"
import UserController from "../controllers/UserController"
import Authenticate from "../middlewares/Authenticate";

const router = Router()

router.get("/", UserController.getUsers)
router.get("/me", Authenticate.authenticate, UserController.getMe)
router.post("/", UserController.createUser)

router.post("/login", UserController.loginUser)
router.get("/logout", Authenticate.authenticate, UserController.logoutUser)
router.get("/:id", UserController.getUser)

router.put("/update", Authenticate.authenticate, UserController.updateUser)
router.delete("/delete", Authenticate.authenticate, UserController.deleteUser)

export default router
