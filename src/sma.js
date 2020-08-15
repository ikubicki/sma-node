const axios = require('axios')
const https = require('https');
const constants = require('./constants');

class SMAClient
{
    constructor (options = {})
    {
        this.options = {
            right: 'usr', 
            ...options
        }
        if (typeof this.options.url === 'undefined!') {
            throw Error('No SMA url specified');
        }
        if (typeof this.options.right === 'undefined') {
            throw Error('No SMA user name specified!');
        }
        if (typeof this.options.pass === 'undefined') {
            throw Error('No SMA password specified!');
        }
        this.sid = null
        this.connector = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })
        console.log(`Connecting to ${this.options.url}`)
    }
    async pull ()
    {
        await this.login()
        const values = await this.values()
        await this.logout()
        return values
    }
    async login ()
    {
        // console.debug('login')
        var parameters = {
            right: this.options.right,
            pass: this.options.pass
        }
        const url = this.options.url + '/dyn/login.json'
        const response = await this.connector.post(url, parameters)
            .catch(error => console.error(error))
        if (response && response.data && response.data.result && response.data.result.sid) {
            this.sid = response.data.result.sid
            return true
        }
        return false
    }
    async logout ()
    {
        // console.debug('logout('+this.sid+')')
        if (!this.sid) {
            return false
        }
        var parameters = {}
        var url = this.options.url + '/dyn/logout.json?sid=' + this.sid
        const response = await this.connector.post(url, parameters)
            .catch(error => console.error(error))
        if (response &&response.data && response.data.result && response.data.result.isLogin === false) {
            this.sid = null
            return true
        }
        return false
    }
    async values ()
    {
        // console.debug('values('+this.sid+')')
        if (!this.sid) {
            return {}
        }
        var values = {}
        const url = this.options.url + '/dyn/getValues.json?sid=' + this.sid
        const parameters = {
            destDev: [],
            keys: Object.values(constants.values)
        }
        const response = await this.connector.post(url, parameters)
            .catch(error => console.error(error))
        if (response && response.data && response.data.result) {
            const device = response.data.result[Object.keys(response.data.result)[0]]
            Object.keys(constants.values).forEach(key => {
                var value = constants.values[key]
                if (value in device) {
                    values[key] = device[value][1][0]['val']
                }
            })
        }
        // get today yield
        if ('yield_today' in values === false) {
            values['yield_today'] = await this.logger(constants.logger.today)
        }

        var date = (new Date())
        date.setHours(0, 0, 0, 0)
        var timestamp = date.getTime()
        // values['yield_1d'] = await this.logger(constants.logger.past, timestamp - 86400000, timestamp)
        // values['yield_7d'] = await this.logger(constants.logger.past, timestamp - 86400000 * 7, timestamp)
        // values['yield_30d'] = await this.logger(constants.logger.past, timestamp - 86400000 * 30, timestamp)
        return values
    }

    async logger (key, tStart = null, tEnd = null)
    {
        // console.debug('logger('+key+', '+tStart+', '+tEnd+')')
        if (key === constants.logger.today) {
            var date = (new Date())
            date.setHours(0, 0, 0, 0)
            tStart = date.getTime()
            date.setHours(24, 0, 0, 0)
            tEnd = date.getTime()
        }
        const url = this.options.url + '/dyn/getLogger.json?sid=' + this.sid
        const parameters = {
            destDev: [],
            key,
            tStart: tStart / 1000,
            tEnd: tEnd / 1000
        }
        const response = await this.connector.post(url, parameters)
            .catch(error => console.error(error))
        if (response && response.data && response.data.result) {
            const logs = response.data.result[Object.keys(response.data.result)[0]]
            if (logs.length > 1) {
                const firstLog = logs[0];
                const lastLog = logs.pop();
                return lastLog.v - firstLog.v;
            }
        }
        return 0
    }
}

module.exports = SMAClient