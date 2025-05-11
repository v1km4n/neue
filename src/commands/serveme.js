const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const discordIDs = require("../config.json");
const axios = require('axios');
require('dotenv').config();

const servemeApiKey = process.env.SERVEMEAPIKEY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serveme')
        .setDescription('Interaction with serveme.tf'),
    async execute(interaction){
        const deferred = await interaction.deferReply({ withResponse: true });
        if (interaction.inGuild()) {
            interaction.editReply('> **Error:** This command has to be used in DMs');
            return;
        }

        if (!discordIDs.servemeWhitelist.includes(interaction.user.id)) {
            interaction.editReply('> **Error:** You are not whitelisted to use this command');
            return;
        }

        if (!await checkForServers()) {
            interaction.editReply('> **Error:** No servers available');
            return;
        }

        const reservation = await makeReservation();
        if (reservation.request.status === 200) {
            const reservationEmbed = await createReservationEmbed(reservation);

            const openReservationButton = new ButtonBuilder()
                .setURL(`https://serveme.tf/reservations/${reservation.request.data.reservation.id}`)
                .setLabel('Open serveme.tf')
                .setStyle(ButtonStyle.Link);


            const endReservationButton = new ButtonBuilder()
                .setCustomId('end')
                .setLabel('End Reservation')
                .setStyle(ButtonStyle.Danger);

            const actionRow = new ActionRowBuilder()
                .addComponents(openReservationButton, endReservationButton);

            const response = await interaction.editReply({
                embeds: [reservationEmbed],
                components: [actionRow],
                withResponse: true
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await deferred.resource.message.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 18_000_000 // 5hrs
                });

                if (confirmation.customId === 'end') {
                    const reservationEndStatus = await endReservation(reservation.request.data.reservation.id);
                    if (reservationEndStatus) {
                        confirmation.update({ content: `> **Info:** Reservation ended`, components: [new ActionRowBuilder().addComponents(openReservationButton)] });
                    } else {
                        confirmation.update({ content: `> **Error:** Reservation has already ended`, components: [new ActionRowBuilder().addComponents(openReservationButton)] });
                    }
            	}
            } catch {
                await interaction.editReply(`> **Info:** You will now have to end the reservation manually`);
            }

        } else if (reservation.request.status === 400) {
            await interaction.editReply(`> **Error:** Can't make another reservation`);
        } else {
            await interaction.editReply(`> **Error:** Unknown error`);
        }
    }
};

// refer to docs: https://github.com/Arie/serveme#api
async function checkForServers() {
    const timeResponse = await axios.get(`https://serveme.tf/api/reservations/new?api_key=${servemeApiKey}`);
    const reservation = timeResponse.data.reservation;
    const serversResponse = await axios.post(`https://serveme.tf/api/reservations/find_servers?api_key=${servemeApiKey}`, reservation);

    return serversResponse.data.servers.length !== 0;
}

async function makeReservation() {
    let germanServers = [];
    let dutchServers = [];
    let frenchServers = [];

    const timeResponse = await axios.get(`https://serveme.tf/api/reservations/new?api_key=${servemeApiKey}`);
    const reservation = timeResponse.data.reservation;
    const serversResponse = await axios.post(`https://serveme.tf/api/reservations/find_servers?api_key=${servemeApiKey}`, reservation);

    for (let i in serversResponse.data.servers) {
        if (serversResponse.data.servers[i].flag === "nl") dutchServers.push(serversResponse.data.servers[i]);
        if (serversResponse.data.servers[i].flag === "de") germanServers.push(serversResponse.data.servers[i]);
        if (serversResponse.data.servers[i].flag === "fr") frenchServers.push(serversResponse.data.servers[i]);
    }

    //reservation settings
    let flagEmoji = null;
    let serverId = null;

    // prefer nl servers by default, then de, then fr
    if (dutchServers.length !== 0) {
        serverId = dutchServers[0].id;
        flagEmoji = ":flag_nl:";
    } else if (germanServers.length !== 0) {
        serverId = germanServers[0].id;
        flagEmoji = ":flag_de:";
    } else {
        serverId = frenchServers[0].id;
        flagEmoji = ":flag_fr:";
    }

    let reservationSettings = {
        reservation: {
            starts_at: reservation.starts_at,
            ends_at: reservation.ends_at,
            server_id: serverId,
            password: generatePass(16),
            rcon: generatePass(20),
            first_map: "cp_process_f12",
            tv_password: "tv",
            tv_relaypassword: "tv",
            server_config_id: null,
            whitelist_id: null,
            custom_whitelist_id: null,
            auto_end: false,
            enable_plugins: true,
            enable_demos_tf: true
        }
    };

    return {
        request: await axios.post(`https://serveme.tf/api/reservations?api_key=${servemeApiKey}`, reservationSettings, {validateStatus: false}),
        flag: flagEmoji
    }
}

async function createReservationEmbed(reservation) {
    const servemePic = 'https://c.disquscdn.com/uploads/users/4077/4747/avatar128.jpg';
    return new EmbedBuilder()
        .setColor('#8b4dfe')
        .setAuthor({ name: `serveme.tf reservation #${reservation.request.data.reservation.id}` })
        .setTitle(`${reservation.flag} ${reservation.request.data.reservation.server.name}`)
        .setThumbnail(servemePic)
        .addFields(
            {
                name: `**Connect**`,
                value: `connect ${reservation.request.data.reservation.server.ip_and_port}; password "${reservation.request.data.reservation.password}"`
            },
            {
                name: `**Rcon**`,
                value: `rcon_address ${reservation.request.data.reservation.server.ip_and_port}; rcon_password "${reservation.request.data.reservation.rcon}"`
            },
            {
                name: `**STV**`,
                value: `connect ${reservation.request.data.reservation.server.ip}:${reservation.request.data.reservation.tv_port}; password "${reservation.request.data.reservation.tv_password}"`
            });
}

async function endReservation(reservationID) {
    const getResponse = await axios.get(`https://serveme.tf/api/reservations/${reservationID}?api_key=${servemeApiKey}`);
    if (!getResponse.data.reservation.ended) { // if has not yet ended
        await axios.delete(`https://serveme.tf/api/reservations/${reservationID}?api_key=${servemeApiKey}`);
        return true;
    } else {
        return false;
    }
}

function generatePass(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
	return result;
}
