const { SlashCommandBuilder, MessageFlags } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ephemeral')
        .setDescription('Ephemeral response')
        .addBooleanOption(option => option.setName('ephemeral').setDescription('Private?').setRequired(true))
        .addStringOption(option => option.setName('input').setDescription('String to reply')),
    async execute(interaction) {
        const input = interaction.options.getString('input') ?? 'Empty string!';
        const ephemeral = interaction.options.getBoolean('ephemeral');
        if (ephemeral) {
            await interaction.reply({content: `${input}`, flags: MessageFlags.Ephemeral});
        }
        else {
            await interaction.reply(`${input}\n`);
        }
    },
};
