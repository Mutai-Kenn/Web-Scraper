const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = 3000

const app = express()

// Getting data from the url site function
async function getPriceFeed(){
    try{
        const url = 'https://coinmarketcap.com/';

        // Get data
        const { data } = await axios({
            method: "GET",
            url: url,
        })
        
        const $ = cheerio.load(data)
        const elementSelector = '.h7vnx2-2 > tbody:nth-child(3) > tr'

        const keys = [
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'
        ]

        const coinArr = []

        $(elementSelector).each((parentIdx, parentElem) => {
            let keyIndex = 0
            const coinObj = {}

            if(parentIdx <= 9) {
                console.log(parentIdx)
                $(parentElem).children().each((childIdx, childElem) => {
                    let tdValue = $(childElem).text()

                    if(keyIndex === 1 || keyIndex === 6){
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if(tdValue){
                        coinObj[keys[keyIndex]] = tdValue

                        keyIndex++
                    }
                    
                })
               coinArr.push(coinObj)
            }

        })
        return coinArr
        
    }catch(err){
        console.error(err)
    }

}

app.get('/', async (req,res) => {
    try{
        const priceFeed = await getPriceFeed()
        return res.status(200).json({
            result: priceFeed,
        })

    }catch(err){
        return res.status(500).json({
            err: err.toString(),
        })
        
    }
})

app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`));

