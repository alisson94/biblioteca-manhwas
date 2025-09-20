const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const multer = require('multer')
const { storage } = require('./config/cloudinary')
const connectDB = require('./config/db')
const Manhwa = require('./models/Manhwa')
const { isGeneratorFunction } = require('util/types')

connectDB()

const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


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

//ADICIONAR MANHWA
app.post('/adicionar', upload.single('capa'), async (req, res) => {

    try{
        const capaPath = req.file.path

        const { titulos, status, capitulos, tags } = req.body


        const novoManhwa = new Manhwa({
            slug: req.body.titulos[0].toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
            titulos,
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

//ATUALIZAR MANHWA
app.post('/manhwa/atualizar/:slug', upload.single('capa'), async (req, res) => {
    try {
        const { slug } = req.params

        const capaPath = req.file ? req.file.path : null

        const { titulos, status, capitulos, tags } = req.body

        const novoManhwa = {
            titulos,
            status,
            capitulos,
            tags: tags.split(',').map(tag => tag.trim())
        }

        if(capaPath){
            novoManhwa.capa = capaPath
        }

        const manhwa = await Manhwa.findOneAndUpdate({ slug }, novoManhwa, { new: true })

        if (!manhwa) {
            return res.status(404).send('Manhwa não encontrado')
        }

        res.redirect(`/manhwa/${manhwa.slug}`)

    } catch (error) {
        console.error('Erro ao atualizar manhwa:', error)
        return res.status(500).send('Erro interno do servidor')
    }
})

//ADICIONAR LINK
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

//ATUALIZAR CAPITULO
app.post('/manhwa/atualizar-capitulo', async (req, res) => {
    try{
        const { manhwaSlug, manhwaLink, novoValor } = req.body

        const manhwa = await Manhwa.findOne({slug: manhwaSlug})
        if (!manhwa) {
            return res.status(404).json({ success: false, message: "Manhwa não encontrado" })
        }
        const link = manhwa.links.find(l => l.url === manhwaLink)
        if (!link) {
            return res.status(404).json({ success: false, message: "Link não encontrado" })
        }
        link.cap_atual = parseInt(novoValor)

        await manhwa.save()
        return res.json({ success: true, message: "Sucesso" })
        
    }catch(e){
        console.error("Erro ao atualizar capitulo", e);
    }
})



app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})