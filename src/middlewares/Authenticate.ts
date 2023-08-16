import { Request, Response, NextFunction } from "express"
import UserModel, { IUser } from "../models/UserModel"
import TaskModel, { ITasks } from "../models/TaskModel"
import ProjectModel, {IProject} from "../models/ProjectModel";

export default class Authenticate {
    public static async authenticate( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const token = req.cookies.token || req.headers.token
            if (!token) {
                res.status(401).json({ message: 'Unauthorized' })
            }

            const user: IUser | null = await UserModel.findByToken(token)
            if (!user) {
                throw new Error("Invalid token")
            }

            // const userObj = user.toObject()
            // delete userObj.Password
            //
            // req.body.user = userObj
            req.body.user = user
            next()
        } catch (error) {
            next(error)
        }
    }

    public static async authorizeTask( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const user = req.body.user
            const { id: taskId } = req.params
            // check if id is valid
            if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error("Invalid id")
            }
            const task: ITasks = await TaskModel.findById(taskId)

            if (!task) {
                throw new Error("Task not found")
            }

            if (task.Creator.toString() !== user._id.toString() && !task.Assignee && task.Assignee.toString() !== user._id.toString()) {
                throw new Error("You are not authorized to perform this action")
            }

            req.body.task = task
            next()
        } catch (error) {
            next(error)
        }
    }

    public static async authorizeProject( req: Request, res: Response, next: NextFunction ): Promise<void> {
        try {
            const user = req.body.user
            const { id: projectId } = req.params
            // check if id is valid
            if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
                throw new Error("Invalid id")
            }
            const project: IProject = await ProjectModel.findById(projectId)

            if (!project) {
                throw new Error("Project not found")
            }

            if (project.Owner.toString() !== user._id.toString()) {
                throw new Error("You are not authorized to perform this action")
            }

            req.body.project = project
            next()
        } catch (error) {
            next(error)
        }
    }
}