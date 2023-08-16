import { Schema, model, Document, Model } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import configs from "../config/configs"

export interface IUser extends Document {
    UserName: string
    Email: string
    Password: string

    GenerateToken: () => string
    ComparePassword: (password: string) => Promise<boolean>
}

interface UserModel extends Model<IUser> {
    findByToken(token: string): IUser | null
}

const UserSchema: Schema<IUser> = new Schema(
    {
        UserName: {
            type: String,
            required: true,
            unique: true
        },
        Email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (email: string) => {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)
                }
            }
        },
        Password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    {
        timestamps: true
    }
)

UserSchema.methods.ComparePassword = async function (password: string) : Promise<boolean> {
    return await bcrypt.compare(password, this.Password)
}

UserSchema.methods.GenerateToken = function () : string {
    return jwt.sign(
        {_id: this._id},
        configs.JWT_SECRET,
        {expiresIn: configs.JWT_EXPIRES_IN}
    )
}

UserSchema.statics.findByToken = async function (token: string) : Promise<IUser | null> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, configs.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err)
            }
            resolve(this.findOne({_id: decoded._id}))
        })
    })
}

UserSchema.pre("save", async function (next) {
    if (this.isModified("Password")) {
        const salt = await bcrypt.genSalt()
        this.Password = await bcrypt.hash(this.Password, salt)
    }
    next()
})

export default model<IUser, UserModel>("User", UserSchema)
