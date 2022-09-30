const PORT = process.env.PORT || 8000 
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const cryptoNewsBlogs = [
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com/',
        base: 'https://cointelegraph.com'
    },
    {
        name: 'cryptonews',
        address: 'https://crypto.news/',
        base: ''
    },
    {
        name: 'cryptonewscom',
        address: 'https://cryptonews.com',
        base: ''
    },
    {
        name: 'coindesk',
        address: 'https://coindesk.com/',
        base: ''
    },
    {
        name: 'cryptoworldcnbc',
        address: 'https://www.cnbc.com/cryptoworld/',
        base: ''
    },
    {
        name: 'cryptopotato',
        address: 'https://cryptopotato.com/crypto-news/',
        base: ''

    },
    {
        name: 'cryptonewsnet',
        address: 'https://cryptonews.net/',
        base: 'https://cryptonews.net'
    }
]

const articles = []

cryptoNewsBlogs.forEach(cryptoNewsBlog => {
    axios.get(cryptoNewsBlog.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)


            $('a:contains("crypto")', html).each(function () {
               const title = $(this).text()
               const url = $(this).attr('href')

               articles.push({
                title,
                url: cryptoNewsBlog.base + url,
                source: cryptoNewsBlog.name
               })
            })
        
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Crypto API')
})


app.get('/news', (req, res) => {

    res.json(articles)

})


app.get('/news/:cryptoNewsBlogId', (req, res) => {
    const cryptoNewsBlogId = req.params.cryptoNewsBlogId

    
    const cryptoNewsBlogAddress = cryptoNewsBlogs.filter(cryptoNewsBlog => cryptoNewsBlog.name == cryptoNewsBlogId)[0].address
    const cryptoNewsBase = cryptoNewsBlogs.filter(cryptoNewsBlog => cryptoNewsBlog.name == cryptoNewsBlogId)[0].base

    axios.get(cryptoNewsBlogAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("crypto")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: cryptoNewsBase + url,
                    source: cryptoNewsBlogId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})



app.listen(PORT, () => console.log(`server running on port PORT ${PORT}`))