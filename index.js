import dotenv from 'dotenv'
import { Client, GatewayIntentBits, EmbedBuilder  } from 'discord.js';
import axios from 'axios';

dotenv.config();

const prefix = "!"


const client = new Client({
    intents : [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if(message.author.bot || !message.content.startsWith(prefix)) return;

    const command = await parseCommand(message);
    if(!command)
        return;

    switch (command.command) {
        case "stats":
            await sendEmbedMessage(await statsCommand(command.player), message.channel);
            break;
    
        case "elo":
            let msg = await eloCommand(command.player);
            await sendSimpleMessage(msg, message.channel);
            break;
        default:
            console.log("unrecognized command: " + command.command)
            break;
    }

})

async function sendSimpleMessage(message, channel)
{
    if(!message)
        return;

    await channel.send(message);
}

async function sendEmbedMessage(message, channel)
{
    await channel.send({embeds: [message]});
}

async function parseCommand(message)
{
    const regex = /^!(\w+)(?:\s+(\S+))?$/;
    const commands = message.content.match(regex);

    if(!commands[0] === prefix)
        return;

    let command = commands[1].toLowerCase();

    switch (command) {
        case 'stats':
            if (commands[2]) {
                return { command: "stats", player: commands[2] };
            }
            break;
        case 'elo':
            if (commands[2]) {
                return { command: "elo", player: commands[2] };
            }
            break;
        default:
            break;
    }
}

async function fetchPlayer(player)
{
    const url = `https://open.faceit.com/data/v4/players?nickname=${player}&game=CS2`
   
    const config = {
        headers: {
            'accept': 'application/json',
            'authorization': 'Bearer ' + process.env.FACEIT_TOKEN
        }
    }
    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Player not found");
        } else {
            console.error("Error fetching player:", error.message);
        }
        return null; // Return null in case of error
    }
}

async function statsCommand(player, limit)
{
    const playerStats = await fetchPlayerStats(player, limit);

    if(!playerStats)
        return ("dunno");

    const stats = calculateStats(playerStats);

    return buildStatsEmbeddedMessage(stats, player)

}

function buildStatsEmbeddedMessage(stats, playername)
{
    try {
        const msg = new EmbedBuilder()
        .setTitle(playername + "'s stats")
        .setColor("#FFFFFF")
        .addFields(
            { name: 'Matches Played', value: stats.matches.toString() },
            { name: 'Wins', value: stats.wins.toString(), inline: true },
            { name: 'Losses', value: stats.loss.toString(), inline: true },
            { name: 'Win/Loss ratio', value: stats.wr.toString(), inline: true },
            { name: 'Kills', value: stats.kills.toString() , inline: true},
            { name: 'Deaths', value: stats.deaths.toString(), inline: true },
            { name: 'hs %', value: `${stats.hsPercent}%`, inline: true },
            { name: 'Kill/Death Ratio (KD)', value: stats.kd.toFixed(2), inline: true },
            { name: 'Kill/Round Ratio (KR)', value: stats.kr.toFixed(2), inline: true }
        )
        return msg;

    } catch (error) {
        console.log(error)
    }
   
    
}

function calculateStats(matchStats)
{
    let kills = 0;
    let deaths = 0;
    let headshots = 0;
    let rounds = 0;

    let matches = 0;

    let wins = 0;
    let loss = 0;

    matchStats.items.forEach(match => {
        kills += parseInt(match.stats.Kills) || 0;
        deaths += parseInt(match.stats.Deaths) || 0;
        headshots += parseInt(match.stats.Headshots) || 0;
        rounds += parseInt(match.stats.Rounds) || 0;
        matches++;

        if(match.stats.Result === "1")
            wins++;
        else
            loss++;

    });

    const hsPercent = kills !== 0 ? Math.round((headshots / kills) * 100 * 10) / 10 : 0;

    const kd = deaths !== 0 ? kills / deaths : 0;
    const kr = rounds !== 0 ? kills / rounds : 0;
    const wr = matches !== 0 ? wins / matches : 0;

    const stats = {
        matches,
        wins,
        loss,
        kills,
        deaths,
        hsPercent,
        kd,
        kr,
        wr
    }
    return stats;
}

async function fetchPlayerStats(player, limit = 40)
{

    const response = await fetchPlayer(player);
    const playerId = response.player_id;

    const url = `https://open.faceit.com/data/v4/players/${playerId}/games/cs2/stats?limit=${limit}`
   
    const config = {
        headers: {
            'accept': 'application/json',
            'authorization': 'Bearer ' + process.env.FACEIT_TOKEN
        }
    }
    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Player not found");
        } else {
            console.error("Error fetching player:", error.message);
        }
        return null; // Return null in case of error
    }
}

async function eloCommand(player)
{
    const response = await fetchPlayer(player);
    if(!response)
        return "Could not find player: " + player + ".";    
    let gameData = null;
    for(const game in response.games)
    {
        if(game === "cs2")
            gameData = response.games[game]; 
    }
    
    if (!gameData)
        return "Player: " + player + " could not be found with game CS2."

    if (gameData && gameData.faceit_elo)
        return player + " currently has: " + gameData.faceit_elo + " elo.";
    

    return "Unresolved issue.";

}


client.login(process.env.DISCORD_TOKEN);