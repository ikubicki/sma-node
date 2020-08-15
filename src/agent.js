const FileStorage = require('./storage/file')
const UrlStorage = require('./storage/url')

class Agent
{
    constructor ({client, destination = null})
    {
        if (! destination) {
            throw Error('Destination not specified!');
        }
        if (destination.indexOf('http') !== 0) {
            this.storage = new FileStorage(destination)
        }
        else {
            this.storage = new UrlStorage(destination)
        }
        this.client = client
    }

    run (interval = 300)
    {
        const callback = async () => {
            const data = await this.client.pull()
            this.store(data)
        }
        setInterval(callback, interval * 1000)
    }

    store (data)
    {
        this.storage.store(data)
    }
}

module.exports = Agent