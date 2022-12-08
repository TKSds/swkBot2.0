const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

// constants used to represent folder names
const OPTION_NERVI = "nervi";
const OPTION_ALCOOLIC = "alcoolic";
const OPTION_ANEVRISM = "anevrism";
const OPTION_NEW = "new";

// list that holds all audio files
var list = [];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Displays all possible play commands for swk bot 2.0!"),
  async execute(interaction) {
    populateListFromLocalAudioFiles(list, OPTION_NERVI);
    populateListFromLocalAudioFiles(list, OPTION_ALCOOLIC);
    populateListFromLocalAudioFiles(list, OPTION_ANEVRISM);
    populateListFromLocalAudioFiles(list, OPTION_NEW);
    await interaction.channel.send(
      list.map((i) => `${list.indexOf(i) + 1}. ${i}`).join("\n")
    );
  },
};

/**
 * Method populates list that is used to display possbile play options.
 *
 * @param {*} list to hold options
 * @param {*} option where the audio files are located
 */
function populateListFromLocalAudioFiles(list, option) {
  const audioFiles = fs
    .readdirSync(`./resources/audioFiles/${option}`)
    .filter((file) => file.endsWith(".mp3"));

  for (const file of audioFiles) {
    var fileNameArray = file.split(".");
    const fileName = fileNameArray[0];
    list.push(fileName);
  }
}
