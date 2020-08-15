const fs = require('fs')
const path = require('path')

class FileStorage
{
    constructor (filename)
    {
        this.failures = 0
        this.filename = filename
        if (fs.existsSync(this.filename) === false) {
            var dirname = path.dirname(this.filename)
            if (fs.existsSync(dirname) === false) {
                fs.mkdirSync(dirname)
            }
            fs.writeFileSync(this.filename, '')
        }
        if (fs.lstatSync(this.filename).isFile() === false) {
            throw Error('Specified filename is a directory!')
        }
        console.log(`Will store logs in ${this.filename}`)
    }

    store (data)
    {
        if (typeof data !== 'string') {
            data = JSON.stringify(data)
        }
        fs.appendFileSync(this.filename, data)
        fs.appendFileSync(this.filename, "\r\n")
        this.failures = 0
    }
}

module.exports = FileStorage
