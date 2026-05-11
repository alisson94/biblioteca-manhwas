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

app.use('/api', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
    }

    return next()
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


app.get('/api/health', (req, res) => {
    return res.json({ success: true, status: 'ok', service: 'biblioteca-manhwas-api' })
})

app.use('/', webManhwasRoutes)

app.use('/api/v1/manhwas', apiManhwasRoutes)

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})