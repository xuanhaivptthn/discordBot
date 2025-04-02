const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const https = require('https');
const path = require('path');

const downloadFile = (url, filename, callback) => {
    const folderPath = path.join(__dirname, 'FileDL');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, filename);

    const file = fs.createWriteStream(filePath);
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', () => {
            file.close(() => {
                console.log(`Downloaded and saved to: ${filePath}`);
                callback();
            });
        });
    }).on('error', function(err) {
        fs.unlink(filePath, err => {});
        console.error(`Error downloading file: ${err.message}`);
    });
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upload')
        .setDescription('upload')
        .addAttachmentOption(option => option.setName('file').setDescription('Test file upload').setRequired(true)),
    async execute(interaction) {
        const file = interaction.options.getAttachment('file');
        downloadFile(file.url,file.name, () => {
            interaction.reply(`Saved ${file.name}`);
        })
    },
};
