const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trezirea')
        .setDescription('Replies to trezirea with mega image rush'),
    async execute(interaction) {
        await interaction.reply('Brb merg pana mega sa iau 2 beri, respect');
    }
};
