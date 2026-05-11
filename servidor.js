const express = require('express')
const path = require('path')
const app = express()
const connectDB = require('./config/db')
const apiManhwasRoutes = require('./routes/api/manhwas')
const webManhwasRoutes = require('./routes/web/manhwas')
const errorHandler = require('./middleware/errorHandler')

connectDB()

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.use('/', webManhwasRoutes)

app.use('/api/v1/manhwas', apiManhwasRoutes)

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})