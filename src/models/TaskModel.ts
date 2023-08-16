import { Schema, model, Document} from "mongoose";

export enum EnumStatus {
    ToDo = "todo",
    InProgress = "inProgress",
    Done = "done"
}

export enum EnumPriority {
    Low = "low",
    Medium = "medium",
    High = "high"
}

export interface ITasks extends Document {
    Title: string
    Description: string
    DueDate: Date
    Status: EnumStatus
    Priority: EnumPriority
    Assignee: Schema.Types.ObjectId | null
    Creator: Schema.Types.ObjectId
    CreatedAt: Date
    UpdatedAt: Date
}

const TaskSchema: Schema<ITasks> = new Schema(
    {
        Title: {
            type: String,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        DueDate: {
            type: Date,
            required: true
        },
        Status: {
            type: String,
            enum: Object.values(EnumStatus),
            required: true
        },
        Priority: {
            type: String,
            enum: Object.values(EnumPriority),
            required: true
        },
        Assignee: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        Creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

export default model<ITasks>("Task", TaskSchema)
