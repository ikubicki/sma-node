const axios = require('axios')
const https = require('https');

class UrlStorage
{
    constructor (baseURL)
    {
        this.failures = 0
        this.connector = axios.create({
            baseURL,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log(`Will send logs to ${baseURL}`)
    }

    store (data)
    {
        if (this.failures >= 30) {
            console.error('There was 30 consecutive failures in sending data to the URL. Stopping!')
            process.exit(1)
        }
        if (typeof data === 'string') {
            data = JSON.parse(data)
        }
        this.connector.request({method: 'POST', data})
            .then(response => {
                this.failures = 0
                if (response.status > 299) {
                    console.error(`Invalid response status: ${response.status}`)
                }
            })
            .catch(error => {
                this.failures++
                console.error(error.message, '['+this.failures+']')
            })
    }
}

module.exports = UrlStorage
