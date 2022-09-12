const { SlashCommandBuilder } = require("@discordjs/builders");
const { joinVoiceChannel } = require("@discordjs/voice");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins a given voice channel."),
  async execute(interaction, client) {
    let voiceChannelList = [];

    let channels = (await interaction.guild.channels.fetch()).filter(
      (channel) => channel.type !== 0
    );

    for (const channel of channels) {
      voiceChannelList.push({ id: channel[0], name: channel[1].name });
    }

    const voiceChannelName = interaction.content.substring(10);
    var voiceChannelId = "";

    for (const voiceChannelObject of voiceChannelList) {
      if (
        voiceChannelName.toLowerCase() === voiceChannelObject.name.toLowerCase()
      ) {
        voiceChannelId = voiceChannelObject.id;
      }
    }

    const guildId = config.guildId;
    const voiceChannel = client.channels.cache.get(voiceChannelId);
    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
    await interaction.reply(`Connected to voice channel: ${voiceChannelName}`);
  },
};