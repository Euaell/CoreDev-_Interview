import { Schema, model, Document } from "mongoose"

export interface IProject extends Document {
    Name: string
    Description: string
    Owner: Schema.Types.ObjectId
    Tasks: Schema.Types.ObjectId[]
    CreatedAt: Date
    UpdatedAt: Date
}

const ProjectSchema: Schema<IProject> = new Schema(
    {
        Name: {
            type: String,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        Owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        Tasks: [{
            type: Schema.Types.ObjectId,
            ref: "Task",
            default: []
        }]
        },
        {
            timestamps: true
        }
)

export default model<IProject>("Project", ProjectSchema)
