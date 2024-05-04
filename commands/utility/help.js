const { SlashCommandBuilder,EmbedBuilder } = require('discord.js')


module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
    .setName("fshelp")
    .setDescription("Get alls commands for Faceit Stats bot, and how to use them"),
    async execute (interaction){
        var message = new EmbedBuilder()
        .setTitle("Help for Faceit Stats commands")
        .addFields("/stats playername", "Get the stats of a player. Playername is case sensetive. Optional extra parameter to add based on how many matches")
        .addFields("/elo playername", "Get the current elo of a player. Playername is case sensetive.")
        .addFields("/compare playername playername", "Compare two players, the player names are case sensetive.")
        
        interaction.reply({embeds: [message]})
    }
}


