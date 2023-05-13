const fs = require("fs")
const express = require('express')
const app = express()
const formidable = require('formidable')

app.use(express.static('public'))

app.post('/', (req, res) => {
    const form = formidable()

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.status(500).json(err)
            return
        }
        const buffer = fs.readFileSync(files.textFile.filepath)
        let fileContent = buffer.toString()
        let mfw = getMostFrequentWord(fileContent)

        let pattern = new RegExp("\\b"+mfw+"\\b", 'gi')
        fileContent = fileContent.replace(pattern, `foo${mfw}bar`)

        res.json({ "fileContent": fileContent })
    });
})

function getMostFrequentWord(fileContent) {
    const regExp = /\b([A-Za-z0-9]+)\b/gi
    const words = fileContent.match(regExp)

    let theMostFrequentWord = ''
    let wordFrequency = 0
    let count = 0
    const numberOfWords = words.length

    for (let i = 0; i < numberOfWords; i++) {
        count = 0

        for (let j = 0; j < numberOfWords; j++) {
            if (words[i] === words[j]) {
                count++
            }
        }

        if (count > wordFrequency) {
            wordFrequency = count
            theMostFrequentWord = words[i]
        }
    }

    return theMostFrequentWord
}

app.listen(4000)

