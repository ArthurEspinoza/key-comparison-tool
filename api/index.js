const express = require('express');
const Router = express.Router();
const fs = require('fs').promises;

const writeLines = async (language, items, res) => {
    try {
        const filePath = `./public/data/${language}.json`;
        const fileData = await fs.readFile(filePath);
        const jsonFile = JSON.parse(fileData);

        for (const key in items) {
            jsonFile[key] = items[key];
        }
        
        res.json(jsonFile);
    } catch (error) {
        res.status(500).json({mensaje: 'Ocurrio un error al abrir el json en data', error})
    }
}

Router.post('/getJson', (req, res) => {
    const {language, items} = req.body;
    writeLines(language, items, res);
});

module.exports = Router;