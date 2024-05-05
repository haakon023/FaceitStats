const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { statsCommand } = require('../../fetch');

module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
    .setName('compare')
    .setDescription('Compares two players.')
    .addStringOption(option => 
        option.setName('player1')
        .setDescription('Name of the first player to be compared.')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('player2')
        .setDescription('Name of the second player to be compared.')
        .setRequired(true))
        ,
    async execute(interaction)
    {
        const playerOne = interaction.options.get('player1');
        const playerTwo = interaction.options.get('player2');
        const playerStatsOne = await statsCommand(playerOne.value);
        const playerStatsTwo = await statsCommand(playerTwo.value);

        const comparison = await comparePlayers(playerStatsOne, playerStatsTwo);

        interaction.reply({embeds: [comparison]});
    }
}

async function comparePlayers(player1name, player2name) {

    const player1Stats = player1name;
    const player2Stats = player2name;
        
    // Build embedded message
    const msg = new EmbedBuilder()
        .setTitle("Comparison of " + player1name.name + " and " + player2name.name)
        .setColor("#FFFFFF")
        .addFields(
            { name: 'Matches Played', value: player1Stats.matches + " vs " + player2Stats.matches },
            { name: 'Wins', value: player1Stats.wins + " vs " + player2Stats.wins, inline: true },
            { name: 'Losses', value: player1Stats.loss + " vs " + player2Stats.loss, inline: true },
            { name: 'Win/Loss %', value: player1Stats.wr.toFixed(2) + "% vs " + player2Stats.wr.toFixed(2) + "%", inline: true },
            { name: 'Kills', value: player1Stats.kills + " vs " + player2Stats.kills, inline: true },
            { name: 'Deaths', value: player1Stats.deaths + " vs " + player2Stats.deaths, inline: true },
            { name: 'Headshot %', value: player1Stats.hsPercent.toFixed(2) + "% vs " + player2Stats.hsPercent.toFixed(2) + "%", inline: true },
            { name: 'Kill/Death Ratio (KD)', value: player1Stats.kd.toFixed(2) + " vs " + player2Stats.kd.toFixed(2), inline: true },
            { name: 'Kill/Round Ratio (KR)', value: player1Stats.kr.toFixed(2) + " vs " + player2Stats.kr.toFixed(2), inline: true }
        );
    return msg

}