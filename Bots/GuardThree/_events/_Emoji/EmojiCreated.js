const { Event } = require("../../../../Global/Structures/Default.Events");
const {Guild} = require("../../../../Global/Config/Guild")
const { Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const GuardData = require("../../../../Global/Database/Guard")
const request = require('request');
const guardPenaltyDB = require("../../../../Global/Database/guardPenalty")

class emojiCreate extends Event {
    constructor(client) {
        super(client, {
            name: "emojiCreate",
            enabled: true,
        });    
    }    

 async  onLoad(emoji) {
    if(emoji.guild.id != Guild.ID) return;
    const guild = client.guilds.cache.get(Guild.ID)
    const Guard = await GuardData.findOne({guildID: guild.id})
    const emojiStickersGuardonly = Guard ? Guard.emojiStickersGuard : false;
    if(emojiStickersGuardonly == true){
    let entry = await guild.fetchAuditLogs({type: 60}).then(audit => audit.entries.first());

    const orusbuevladı = await guild.members.cache.get(entry?.executor.id);
    const log = guild.channels.cache.find(x => x.name == "emojisticker-guard")
    const embed = new EmbedBuilder({
        title:"Server Emojis Protection - Security II",
        footer:{text:`Server Security`, iconURL: client.user.avatarURL()}
    })
    if(entry.executor.id == guild.ownerId) return;

    if(!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000 ||orusbuevladı.user.bot)return;
    if (await guvenli(orusbuevladı,"emojisticker") == true){
        await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:true,işlem:`Emoji Oluşturdu (${emoji.name})`,Tarih:Date.now()}}},{upsert:true})
        if(log) return log.send({embeds:[embed.setAuthor({name:`Trustworthy ✅`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${emoji.name}** isimli emojiyi sunucuya ekledi.`)]})
    }
    await ytçek(orusbuevladı)
    await emoji.delete()
    await guardPenaltyDB.findOneAndUpdate({guildID:guild.id,OrusbuEvladı:orusbuevladı.id},{$push:{işlemler:{Güvenilir:false,işlem:`Emoji Oluşturdu (${emoji.name})`,Tarih:Date.now()}}},{upsert:true})
    if(log) return log.send({embeds:[embed.setAuthor({name:`Not safe ❎`, iconURL:guild.iconURL()}).setDescription(`${orusbuevladı}, \`${new Date(Date.now()).toTurkishFormatDate()}\` tarihinde **${emoji.name}** isimli emojiyi eklediği için rolleri alındı ve emoji sunucudan silindi.`)]})
    }
 }
}

module.exports = emojiCreate;