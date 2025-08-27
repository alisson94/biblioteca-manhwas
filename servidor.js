const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const multer = require('multer')
const { storage } = require('./config/cloudinary')

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

app.get('/', (req, res) => {

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err)
            return res.status(500).send('Erro interno do servidor')
        }

        const manhwas = JSON.parse(data)
        res.render('inicio', { manhwas })
    })
})

app.get('/manhwa/:slug', (req, res) => {

    fs.readFile(dbPath, 'utf-8', (err, data)=> {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err)
            return res.status(500).send('Erro interno do servidor')
        }
        
        const manhwas = JSON.parse(data)

        const manhwa = manhwas.find(m => m.slug === req.params.slug)
        if (manhwa) {
            res.render('detalhes', { manhwa })
        } else {
            res.status(404).send('Manhwa não encontrado')
        }
    })

})

app.post('/adicionar', upload.single('capa'), (req, res) => {

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err)
            return res.status(500).send('Erro interno do servidor')
        }
        
        const manhwas = JSON.parse(data)

        if(!req.file){
            return res.status(400).send('Erro ao fazer upload da imagem da capa')
        }

        const capaPath = req.file.path

        const { titulo, autor, status, capitulos, tags } = req.body
        const novoManhwa = {
            id: manhwas.length > 0 ? manhwas[manhwas.length - 1].id + 1 : 1,
            slug: req.body.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''),
            titulo,
            autor,
            capa: capaPath,
            status,
            capitulos,
            tags: tags.split(',').map(tag => tag.trim()),
            links: []
        }
        manhwas.push(novoManhwa)

        fs.writeFile(dbPath, JSON.stringify(manhwas, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo JSON:', err)
                return res.status(500).send('Erro interno do servidor')
            }
            res.redirect('/')
        })
    })
})

app.post('/manhwa/adicionar-link', (req, res) => {
    const { manhwaSlug, idioma, url, cap_total } = req.body

    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err)
            return res.status(500).send('Erro interno do servidor')
        }

        const manhwas = JSON.parse(data)

        const manhwa = manhwas.find( m => m.slug === manhwaSlug)

        if (manhwa) {
            manhwa.links.push({
                idioma,
                url,
                cap_atual: 1,
                cap_total
            })

            fs.writeFile(dbPath, JSON.stringify(manhwas, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Erro ao salvar o arquivo JSON:', err)
                    return res.status(500).send('Erro interno do servidor')
                }
                res.redirect(`/manhwa/${manhwaSlug}`)
            })
        } else {
            res.status(404).send('Manhwa não encontrado')
        }
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})