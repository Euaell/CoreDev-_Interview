import { Response, Request, NextFunction } from "express"
import UserModel, { IUser } from "../models/UserModel"

export default class UserController {
    public static async getUsers( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const users: IUser[] = await UserModel.find()
            return res.status(200).json({users})
        } catch (error) {
            next(error)
        }
    }

    public static async getUser( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const user: IUser | null = await UserModel.findById(req.params.id)
            if (user) {
                return res.status(200).json({user})
            } else {
                return res.status(404).json({message: "User not found"})
            }
        } catch (error) {
            next(error)
        }
    }

    public static async getMe( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const user = req.body.user
            return res.status(200).json({user})
        } catch (error) {
            next(error)
        }
    }

    public static async createUser( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const { UserName, Email, Password } = req.body
            // check if the UserName and Email are already taken
            const user: IUser | null = await UserModel.findOne({$or: [{UserName}, {Email}]})
            if (user) {
                if (user.UserName === UserName) {
                    return res.status(400).json({UserName: "UserName already taken"})
                } else {
                    return res.status(400).json({Email: "Email already taken"})
                }
            }
            const newUser: IUser = await UserModel.create({ UserName, Email, Password })
            return res.status(201).json({ Message: "User created successfully", newUser })
        } catch (error) {
            next(error)
        }
    }

    public static async loginUser( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const { Email, Password } = req.body
            // check if the Email exists
            const user: IUser | null = await UserModel.findOne({Email})
            if (!user) {
                return res.status(400).json({Email: "Email not found"})
            }
            // check if the Password is correct
            const authMessage: boolean = await user.ComparePassword(Password)
            if (!authMessage) {
                return res.status(400).json({Password: "Incorrect Password"})
            }
            // generate token
            const token: string = user.GenerateToken()
            res.cookie("token", token, {httpOnly: true})
            return res.status(200).json({ Message: "User logged in successfully", user })

        } catch (error) {
            next(error)
        }
    }

    public static async logoutUser( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        res.clearCookie("token")
        return res.status(200).json({message: "Logged out"})
    }

    public static async updateUser( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const { id } = req.body.user
            const { UserName, Email, Password } = req.body
            const user: IUser | null = await UserModel.findByIdAndUpdate(id, { UserName, Email, Password }, {new: true})
            if (user) {
                return res.status(200).json({Message: "User updated successfully", user})
            }
            return res.status(404).json({Message: "User not found"})
        } catch (error) {
            next(error)
        }
    }

    public static async deleteUser( req: Request, res: Response, next: NextFunction ): Promise<Response> {
        try {
            const { id } = req.body.user
            const user: IUser | null = await UserModel.findByIdAndDelete(id)
            if (user) {
                return res.status(200).json({Message: "User deleted successfully", user})
            }
            return res.status(404).json({Message: "User not found"})
        } catch (error) {
            next(error)
        }
    }
}
