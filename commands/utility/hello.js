const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('say Hello (what do you expect?)'),
    async execute(interaction) {
        await interaction.reply('Hola!');
    },
};
