import { Request, Response, NextFunction } from "express"
import TaskModel, { ITasks } from "../models/TaskModel"


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
            return res.status(200).json({ tasks, total: tasks.length })
        } catch (error) {
            next(error)
        }
    }

    public static async getTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            // check if id is valid
            if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: "Invalid id" })
            const task: ITasks = await TaskModel.findById(id)
            if (!task) return res.status(404).json({ message: "Task not found" })
            res.status(200).json({ task })
        } catch (error) {
            next(error)
        }
    }

    public static async getMyTasks(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { _id } = req.body.user
            const tasks: ITasks[] = await TaskModel.find({ Creator: _id })
            return res.status(200).json({ tasks, total: tasks.length })
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
            return res.status(200).json({ Tasks, total: Tasks.length })
        } catch (error) {
            next(error)
        }
    }
}
