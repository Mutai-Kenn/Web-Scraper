const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = 3000


const app = express()

const url = 'https://www.bbc.com/';

axios(url)
    .then(response => {
        const html= response.data
        const $ = cheerio.load(html)
        const articles = []


        $('.media__link', html).each(function(){
           const title = $(this).text()
           const link = $(this).attr('href')

           articles.push({
            title,
            link
          
              
           })
            console.log(articles);

        })
    })

app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));