const PORT = 8000
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
        name: 'crypto.news',
        address: 'https://crypto.news/',
        base: ''
    },
    {
        name: 'cryptonews.com',
        address: 'https://cryptonews.com',
        base: ''
    },
    {
        name: 'coindesk',
        address: 'https://coindesk.com/',
        base: ''
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


app.get('/news/:cryptoNewsBlogId', async (req, res) => {
    const cryptoNewsBlogId = req.params.cryptoNewsBlogId
    
    const cryptoNewsBlog = cryptoNewsBlogs.filter(cryptoNewsBlog => cryptoNewsBlog.name == cryptoNewsBlogId)
    axios.get()
})



app.listen(PORT, () => console.log(`server running on port PORT ${PORT}`))