import configs from './config/configs'
import app from './app'
import mongoose from "mongoose";

mongoose.connect(`${configs.MONGO_URI}/${configs.MONGO_DB}`)
    .then(() => {
        console.log("Connected to MongoDB ...")
        app.listen(configs.PORT, () => {
            console.log(`Server is running at http://${configs.HOST}:${configs.PORT}`)
        })
    })
    .catch(console.error)
