const { SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');
const {eloCommand} = require('../../fetch');

module.exports = {
    category: 'utility',
    data : new SlashCommandBuilder()
	.setName('elo')
	.setDescription('Replies with the elo of the user back')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The player to be checked'))
    ,async execute(interaction)
    {
        const name = interaction.options.get('input')
        const lmao = await eloCommand(name.value);
        await interaction.reply(lmao);
    }
}
