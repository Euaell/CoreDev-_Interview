import { Request, Response, NextFunction } from "express"
import TaskModel, { ITasks, EnumStatus, EnumPriority } from "../models/TaskModel"
import UserModel from "../models/UserModel"

export default class TaskController {
    public static async createTask(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { Title, Description, DueDate, Status, Priority, Assignee } = req.body
            const Creator = req.body.user._id
            const task = await TaskModel.create({ Title, Description, DueDate, Status, Priority, Assignee, Creator })
            return res.status(201).json({ task })
        } catch (error) {
            next(error)
        }
    }

    public static async getTasks(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const tasks = await TaskModel.find()
            return res.status(200).json({ tasks })
        } catch (error) {
            next(error)
        }
    }

    public static async getTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const task = await TaskModel.findById(id)
            res.status(200).json({ task })
        } catch (error) {
            next(error)
        }
    }

    public static async getMyTasks(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { _id } = req.body.user
            const tasks: ITasks[] = await TaskModel.find({ Creator: _id })
            return res.status(200).json({ tasks })
        } catch (error) {
            next(error)
        }
    }

    public static async updateTask(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { _id } = req.body.task
            const { Title, Description, DueDate, Status, Priority, Assignee } = req.body

            const newTask: ITasks = await TaskModel.findByIdAndUpdate(_id, { Title, Description, DueDate, Status, Priority, Assignee }, { new: true })
            return res.status(200).json({ task: newTask })
        } catch (error) {
            next(error)
        }
    }

    public static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { _id } = req.body.task
            await TaskModel.findByIdAndDelete(_id)
            return res.status(200).json({ message: "Task deleted successfully" })
        } catch (error) {
            next(error)
        }
    }

    public static async getAssignedTasks(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const Tasks: ITasks[] = await TaskModel.find({ Assignee: req.body.user._id })
            return res.status(200).json({ Tasks })
        } catch (error) {
            next(error)
        }
    }
}
