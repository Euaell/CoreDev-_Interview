import express, { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "./middlewares/ErrorHandler"
import morgan from "morgan"
import cors from "cors"


const app = express()

app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))
app.use(cors())

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Hello World!" })
})

app.use(ErrorHandler)

export default app
