const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')


module.exports = {
    category: 'utility',
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get alls commands for Faceit Stats bot, and how to use them"),
    async execute (interaction){
        var message = new EmbedBuilder()
        .setTitle("Help for Faceit Stats commands")
        .addFields({name:"/stats playername", value:"Get the stats of a player. Playername is case sensetive. Optional extra parameter to add based on how many matches"})
        .addFields({name:"/elo playername", value:"Get the current elo of a player. Playername is case sensetive."})
        .addFields({name:"/compare playername playername", value:"Compare two players, the player names are case sensetive."})
        
        interaction.reply({embeds: [message]})
    }
}


