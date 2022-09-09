const { SlashCommandBuilder } = require("@discordjs/builders");
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

// constants used to represent folder names
const OPTION_NERVI = "nervi";
const OPTION_ALCOOLIC = "alcoolic";
const OPTION_ANEVRISM = "anevrism";

// init choice lists
var nerviChoiceList = [];
var alcoolicChoiceList = [];
var anevrismChoiceList = [];

// populate choice lists
populateListFromLocalAudioFiles(nerviChoiceList, OPTION_NERVI);
populateListFromLocalAudioFiles(alcoolicChoiceList, OPTION_ALCOOLIC);
populateListFromLocalAudioFiles(anevrismChoiceList, OPTION_ANEVRISM);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays swk moments in the Voice Channel")
    .addStringOption((option) => {
      return populateChoiceList(option, nerviChoiceList, OPTION_NERVI);
    })
    .addStringOption((option) => {
      return populateChoiceList(option, alcoolicChoiceList, OPTION_ALCOOLIC);
    })
    .addStringOption((option) => {
      return populateChoiceList(option, anevrismChoiceList, OPTION_ANEVRISM);
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

    if (audioFileNameSelected) {
      var resource = "";

      switch (optionSelected) {
        case OPTION_NERVI:
          // create and play audio
          resource = createAndPlayAudioFile(
            resource,
            audioFileNameSelected,
            OPTION_NERVI,
            player
          );
          break;
        case OPTION_ALCOOLIC:
          resource = createAndPlayAudioFile(
            resource,
            audioFileNameSelected,
            OPTION_ALCOOLIC,
            player
          );
          break;
        case OPTION_ANEVRISM:
          resource = createAndPlayAudioFile(
            resource,
            audioFileNameSelected,
            OPTION_ANEVRISM,
            player
          );
          break;
      }
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

/**
 * Method populates choiceLists that are used in the {@link SlashCommandBuilder}.
 * 
 * @param {*} list to hold choices
 * @param {*} option where the audio files are located
 */
function populateListFromLocalAudioFiles(list, option) {
  const audioFiles = fs
    .readdirSync(`./resources/audioFiles/${option}`)
    .filter((file) => file.endsWith(".mp3"));

  for (const file of audioFiles) {
    var fileNameArray = file.split(".");
    const fileName = fileNameArray[0];
    const choiceObject = { name: fileName, value: fileName };
    list.push(choiceObject);
  }
}

/**
 * Creates and plays selected audio file.
 *
 * @param {*} resource for audio file selected
 * @param {*} audioFileNameSelected audio file to play
 * @param {*} player audio player to play in the VC
 * @returns audio resource created
 */
function createAndPlayAudioFile(
  resource,
  audioFileNameSelected,
  option,
  player
) {
  resource = createAudioResource(
    `C:\\VSProjects\\SwkBot2.0\\resources\\audioFiles\\${option}\\${audioFileNameSelected}.mp3`
  );
  player.play(resource);
  return resource;
}

/**
 * Method populates choice list for an option.
 *
 * @param {*} option the name of the option that is being populated
 * @param {*} list of choices
 * @param {*} choiceOption choice added to option
 * @returns option object
 */
function populateChoiceList(option, list, choiceOption) {
  for (let i = 0; i < list.length; i++) {
    if (!option.name) {
      option.setName(choiceOption).setDescription(choiceOption);
    } else {
      option.addChoices(list[i]);
    }
  }
  return option;
}
