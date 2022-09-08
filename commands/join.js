const { ChannelType } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join Voice Channel')
        .addChannelOption((option) => 
            option
                .setName('channel')
                .setDescription('The channel to join')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        ).toJSON(),
    async execute(interaction) {
        if ( interaction)
        await interaction.reply('Brb merg pana mega sa iau 2 beri, respect');
    }
};