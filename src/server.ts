import configs from './config/configs'
import app from './app'

app.listen(configs.PORT, () => {
    console.log(`Server is running at http://${configs.HOST}:${configs.PORT}`)
})