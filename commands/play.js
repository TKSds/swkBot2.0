const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");
const {
  generateDependencyReport,
  AudioPlayerStatus,
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  voice,
} = require("@discordjs/voice");
const config = require("../config.json");
const fs = require("fs");

// constant used to represent folder names
const OPTION_NERVI = "nervi";
const OPTION_ALCOOLIC = "alcoolic";
const OPTION_ANEVRISM = "anevrism";

const audioNerviFiles = fs
  .readdirSync(`./resources/audioFiles/${OPTION_NERVI}`)
  .filter((file) => file.endsWith(".mp3"));
var nerviChoiceList = [];

const audioAlcoolicFiles = fs
  .readdirSync(`./resources/audioFiles/${OPTION_ALCOOLIC}`)
  .filter((file) => file.endsWith(".mp3"));
var alcoolicChoiceList = [];

const audioAnevrismFiles = fs
  .readdirSync(`./resources/audioFiles/${OPTION_ANEVRISM}`)
  .filter((file) => file.endsWith(".mp3"));
var anevrismChoiceList = [];

// populate nervi choices
for (const file of audioNerviFiles) {
  var fileNameArray = file.split(".");
  const fileName = fileNameArray[0];
  const choiceObject = { name: fileName, value: fileName };
  nerviChoiceList.push(choiceObject);
}

// populate alcoolic choices
for (const file of audioAlcoolicFiles) {
  var fileNameArray = file.split(".");
  const fileName = fileNameArray[0];
  const choiceObject = { name: fileName, value: fileName };
  alcoolicChoiceList.push(choiceObject);
}

// populate anevrism choices
for (const file of audioAnevrismFiles) {
  var fileNameArray = file.split(".");
  const fileName = fileNameArray[0];
  const choiceObject = { name: fileName, value: fileName };
  anevrismChoiceList.push(choiceObject);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays swk moments in the Voice Channel")
    .addStringOption((option) => {
      for (let i = 0; i < nerviChoiceList.length; i++) {
        if (!option.name) {
          option.setName(OPTION_NERVI).setDescription(OPTION_NERVI);
        } else {
          option.addChoices(nerviChoiceList[i]);
        }
      }
      return option;
    })
    .addStringOption((option) => {
      for (let i = 0; i < alcoolicChoiceList.length; i++) {
        if (!option.name) {
          option.setName(OPTION_ALCOOLIC).setDescription(OPTION_ALCOOLIC);
        } else {
          option.addChoices(alcoolicChoiceList[i]);
        }
      }
      return option;
    })
    .addStringOption((option) => {
      for (let i = 0; i < anevrismChoiceList.length; i++) {
        if (!option.name) {
          option.setName(OPTION_ANEVRISM).setDescription(OPTION_ANEVRISM);
        } else {
          option.addChoices(anevrismChoiceList[i]);
        }
      }
      return option;
    }),
  async execute(interaction, client) {
    // get the option used to determine which audioFile to play
    // [0], since we only have one option to the slash command
    const optionSelected = interaction.options._hoistedOptions[0].name;
    const audioFileNameSelected = interaction.options._hoistedOptions[0].value;

    // get voice channel id where the user that issues the command is connected
    const voiceChannelId = interaction.member.voice.channel.id;

    // get the voice channel ids
    const voiceChannel = client.channels.cache.get(voiceChannelId);
    const guildId = config.guildId;

    // create audio player
    const player = createAudioPlayer();

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("The audio player has started playing!");
    });

    player.on("error", (error) => {
      console.error(`Error: ${error.message} with resource`);
    });

    switch (optionSelected) {
      case OPTION_NERVI:
        // create and play audio
        if (audioFileNameSelected) {
          const resource = createAudioResource(
            `C:\\VSProjects\\SwkBot2.0\\resources\\audioFiles\\${OPTION_NERVI}\\${audioFileNameSelected}.mp3`
          );
          player.play(resource);
        }
        break;
      case OPTION_ALCOOLIC:
        if (audioFileNameSelected) {
          const resource = createAudioResource(
            `C:\\VSProjects\\SwkBot2.0\\resources\\audioFiles\\${OPTION_ALCOOLIC}\\${audioFileNameSelected}.mp3`
          );
          player.play(resource);
        }
        break;
      case OPTION_ANEVRISM:
        if (audioFileNameSelected) {
          const resource = createAudioResource(
            `C:\\VSProjects\\SwkBot2.0\\resources\\audioFiles\\${OPTION_ANEVRISM}\\${audioFileNameSelected}.mp3`
          );
          player.play(resource);
        }
        break;
    }

    // create the connection to the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    interaction.reply(`Started playing: ${audioFileNameSelected}`);

    // Subscribe the connection to the audio player (will play audio on the voice connection)
    const subscription = connection.subscribe(player);

    // subscription could be undefined if the connection is destroyed!
    if (subscription) {
      // Unsubscribe after 10 seconds (stop playing audio on the voice connection)
      setTimeout(() => {
        subscription.unsubscribe();
      }, 30000);
    }
  },
};
