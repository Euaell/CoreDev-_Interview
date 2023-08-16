import { Request, Response, NextFunction } from "express"

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // console.log(err)
    if (err.message === "Invalid token") {
        return res.status(401).json({ message: "Unauthorized" })
    }
    if (err.message === "Task not found") {
        return res.status(404).json({ message: "Task not found" })
    }
    if (err.message === "You are not authorized to perform this action") {
        return res.status(403).json({ message: "You are not authorized to perform this action" })
    }
    if (err.message === "Project not found") {
        return res.status(404).json({ message: "Project not found" })
    }
    if (err.message === "Invalid id") {
        return res.status(400).json({ message: "Invalid id" })
    }
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).send("Something went wrong")
}