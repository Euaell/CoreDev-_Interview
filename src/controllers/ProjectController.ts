import { Request, Response, NextFunction } from "express"
import ProjectModel, { IProject } from "../models/ProjectModel";

export default class ProjectController {
    public static async createProject(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const Owner = req.body.user._id
            const { Name, Description } = req.body
            const project = await ProjectModel.create({ Name, Description, Owner })
            return res.status(201).json({ project })
        } catch (error) {
            next(error)
        }
    }

    public static async getProjects(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const projects: IProject[] = await ProjectModel.find().populate("Owner", "-Password")
            return res.status(200).json({ projects, total: projects.length })
        } catch (error) {
            next(error)
        }
    }

    public static async getMyProjects(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const Owner = req.body.user._id
            const projects: IProject[] = await ProjectModel.find({ Owner }).populate("Owner", "-Password")
            return res.status(200).json({ projects, totoal: projects.length })
        } catch (error) {
            next(error)
        }
    }

    public static async getProject(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { id } = req.params
            const project: IProject | null = await ProjectModel.findById(id).populate("Owner", "-Password").populate("Tasks")
            return res.status(200).json({ project })
        } catch (error) {
            next(error)
        }
    }

    public static async updateProject(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const project = req.body.project
            const { Name, Description } = req.body
            project.Name = Name
            project.Description = Description
            await project.save()
            return res.status(200).json({ project })
        } catch (error) {
            next(error)
        }
    }

    public static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const project = req.body.project
            await project.remove()
            return res.status(200).json({ message: "Project deleted" })
        } catch (error) {
            next(error)
        }
    }

    public static async assignTask(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const project = req.body.project
            const { Task } = req.body
            project.Tasks.push(Task)
            await project.save()
            return res.status(200).json({ project })
        } catch (error) {
            next(error)
        }
    }

    public static async unassignTask(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const project = req.body.project
            const { Task } = req.body
            project.Tasks = project.Tasks.filter((task: any) => task._id.toString() !== Task.toString())
            await project.save()
            return res.status(200).json({ project })
        } catch (error) {
            next(error)
        }
    }

    public static async getTasks(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {
            const { _id } = req.body.project
            const project = await ProjectModel.findById(_id).populate("Tasks")
            const tasks = project.Tasks
            return res.status(200).json({ tasks, total: tasks.length })
        } catch (error) {
            next(error)
        }
    }
}