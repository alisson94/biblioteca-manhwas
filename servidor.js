const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const multer = require('multer')
const { storage } = require('./config/cloudinary')
const connectDB = require('./config/db')
const manhwa = require('./models/Manhwa')
const Manhwa = require('./models/Manhwa')

connectDB()

const port = process.env.PORT || 3000
const dbPath = path.join(__dirname, 'manhwas.json')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//PRA UPAR NAS PASTAS LOCAIS
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, 'public', 'images'))
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })
//TESTE DEPLOY

const upload = multer({ storage })

app.get('/', async (req, res) => {

    try{
        const manhwas = await Manhwa.find()
        res.render('inicio', { manhwas })

    }catch (error) {
        console.error('Erro ao buscar manhwas:', error)
        return res.status(500).send('Erro interno do servidor')
    }

})

app.get('/manhwa/:slug', async (req, res) => {

    try{
        const manhwa = await Manhwa.findOne({ slug: req.params.slug })
        if (manhwa) {
            res.render('detalhes', { manhwa })
        } else {
            res.status(404).send('Manhwa não encontrado')
        }
    }catch (error) {
        console.error('Erro ao buscar manhwa:', error)
        return res.status(500).send('Erro interno do servidor')
    }

})

app.post('/adicionar', upload.single('capa'), async (req, res) => {

    try{
        const capaPath = req.file.path

        const { titulo, autor, status, capitulos, tags } = req.body

        const novoManhwa = new manhwa({
            slug: req.body.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
            titulo,
            autor,
            capa: capaPath,
            status,
            capitulos,
            tags: tags.split(',').map(tag => tag.trim()),
            links: []
        })

        await novoManhwa.save()
        //const manhwaSalvo = await novoManhwa.save()
        //res.status(201).json(manhwaSalvo)
        res.redirect('/')
        

    }catch (error) {
        console.error('Erro ao adicionar manhwa:', error)
        return res.status(500).send('Erro interno do servidor')
    }

})

app.post('/manhwa/adicionar-link', async (req, res) => {

    try{
        const { manhwaSlug, idioma, url, cap_total } = req.body

        const manhwa = await Manhwa.findOne({ slug: manhwaSlug })
        if(!manhwa){
            return res.status(404).send('Manhwa não encontrado')
        }

        manhwa.links.push({
            idioma,
            url,
            cap_atual: 1,
            cap_total
        })

        await manhwa.save()
        res.redirect(`/manhwa/${manhwaSlug}`)

    }catch(e){
        console.error('Erro ao adicionar link:', e)
        return res.status(500).send('Erro interno do servidor')
    }


})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})