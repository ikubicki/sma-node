const SMAClient = require('./src/sma')
const Agent = require('./src/agent')

const client = new SMAClient({
    url: process.env.SMA_URL || null,
    right: process.env.SMA_USER || 'usr',
    pass: process.env.SMA_PASS || null
});
const destination = process.env.DESTINATION || '/var/log/sma.log'
const agent = new Agent({client, destination})
agent.run(process.env.INTERVAL || 300)