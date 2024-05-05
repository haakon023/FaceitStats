const { SlashCommandBuilder } = require('discord.js');
const {statsCommand, buildStatsEmbeddedMessage} = require('../../fetch');

module.exports = {
    category: 'utility',
    data : new SlashCommandBuilder()
	.setName('stats')
	.setDescription('Replies with the stats of the player')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The player to be checked')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('limit')
            .setDescription('limits the matches')
            .setRequired(false))
    ,async execute(interaction)
    {
        const name = interaction.options.get('input')
        const limit = interaction.options.get('limit') || 0;
        const stats = await statsCommand(name.value, limit.value);
    
        const statsMsg = buildStatsEmbeddedMessage(stats);

        await interaction.reply({embeds: [statsMsg]});
    }
}
