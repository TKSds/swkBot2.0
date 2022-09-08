const config = require("../config.json");

module.exports = {
  name: "messageCreate",
  on: true,
  async execute(message, client) {
    if (!message.content.includes(config.prefix)) {
      return;
    }

    // fullCommandMessage looks like this: 'prefix' + 'command'
    // we are interested in the 'command' only thus we acces the second object of the array.
    var fullCommandMessage = message.content.split(" ");
    var command = fullCommandMessage[1];

    if (!client.commands.has(command)) {
      return;
    }

    try {
      await client.commands.get(command).execute(message);
    } catch (error) {
      console.log(error);
      await message.reply({ content: "there was an error", ephemeral: true });
    }
  },
};
