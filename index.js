const Discord = require('discord.js')
const bot = new Discord.Client()
const mysql = require("mysql");
const { MessageEmbed } = require('discord.js');


const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    database: "devoirs",

})

db.connect(function (err) {
    if (err) throw err;

    console.log('Connecter a la BDD')
})

bot.on('message', message => {
    if (message.content.startsWith('!agenda')) {
        var embed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle('Matière')
            .addFields(
                { name: 'Math :', value: '📏', inline: true },
                { name: 'Français :', value: '📚', inline: true },
                { name: 'Anglais :', value: '🗽', inline: true },
                { name: 'Python :', value: '📟', inline: true },
                { name: 'CEJM :', value: ' 📊', inline: true },
                { name: 'CYBER :', value: '👨🏽‍💻', inline: true },
                { name: 'Support 1 :', value: '🌐', inline: true },
                { name: 'Support 2 :', value: '💢', inline: true },
                { name: 'Support 3:', value: '📝', inline: true },
            )
        message.channel.send(embed).then((m) => {
            m.react('📏');
            m.react('📚');
            m.react('🗽');
            m.react('📟');
            m.react('📊');
            m.react('👨🏽‍💻');
            m.react('🌐');
            m.react('💢');
            m.react('📝');

            const filter = (reaction, user) => {
                return user.id != '834444320975224872' || user.id === message.author.id && reaction.emoji.name === '📏';
            };

            m.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    var emo = collected.first().emoji.name;
                    switch (emo) {
                        case '📏':
                            var matter = 'math'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de math`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '📚':
                            var matter = 'français'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de français`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '🗽':
                            var matter = 'anglais'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir d'anglais`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '📟':
                            var matter = 'python'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de python`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '📊':
                            var matter = 'cejm'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de CEJM`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '👨🏽‍💻':
                            var matter = 'cyber'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de CYBER`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '🌐':
                            var matter = 'support1'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de Support 1`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '💢':
                            var matter = 'support2'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de Support 2`).then(m => m.delete({ timeout: 2000 }));
                            break;
                        case '📝':
                            var matter = 'support3'
                            message.channel.send(`:white_check_mark: Tu as choisis d'ajouter un devoir de Support 3`).then(m => m.delete({ timeout: 2000 }));
                            break;
                    } setTimeout(() => 7000)
                    m.reactions.removeAll()
                    const newEmbed = new Discord.MessageEmbed()
                        .setColor('YELLOW')
                        .setTitle('Entrer la date du devoir')
                    m.edit(newEmbed)

                    message.channel.awaitMessages(filter, { time: 5000 }).then(collected => {
                        const list = [];
                        collected.forEach((message) => {
                            list.push(message.content);
                            date = list[1]
                            //   console.log(list[1])
                        });

                        setTimeout(() => 4000)
                        m.reactions.removeAll()
                        const newEmbed = new Discord.MessageEmbed()
                            .setColor('RED')
                            .setTitle('Entrer le descriptif du devoir')
                        m.edit(newEmbed)

                        message.channel.awaitMessages(filter, { time: 5000 }).then(collected => {
                            const list2 = [];
                            collected.forEach((message) => {
                                list2.push(message.content);
                                argument = list2[0]
                                //   console.log(list2[0])
                            });
                            db.query("INSERT INTO " + matter + " (id,date,descriptif) VALUES ('0','" + date + "','" + argument + "')")
                            if (db) {
                                message.channel.send('Devoir ajouter ✅')
                            } else {
                                message.channel.send("Erreur lors de l'ajout ❌")
                            }
                        })



                    });
                })
        });
    }

    if (message.content.startsWith('!view')) {
        const filter = (reaction, user) => {
            return user.id != '834444320975224872' || user.id === message.author.id
        };
        const newEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Entrer la date dont vous voulez les devoirs')
        message.channel.send(newEmbed).then((m) => {
            message.channel.awaitMessages(filter, { time: 5000 }).then(collected => {
                const list2 = [];
                collected.forEach((message) => {
                    list2.push(message.content);
                    id = list2[0]
                });
                setTimeout(() => 2000)
                db.query("SELECT descriptif FROM math where date=" + id, function (err, math) {
                    devMath = math.map((row) => row.descriptif)
                    // console.log(devMath)
                    db.query("SELECT descriptif FROM français where date =" + id, function (err, français) {
                        devFrançais = français.map((row) => row.descriptif)
                        // console.log(devFrançais)
                        db.query("SELECT descriptif FROM anglais where date =" + id, function (err, anglais) {
                            devAnglais = anglais.map((row) => row.descriptif)
                            // console.log(devAnglais)
                            db.query("SELECT descriptif FROM python where date =" + id, function (err, python) {
                                devPython = python.map((row) => row.descriptif)
                                //  console.log(devAnglais)  
                                db.query("SELECT descriptif FROM cejm where date =" + id, function (err, cejm) {
                                    devCEJM = cejm.map((row) => row.descriptif)
                                    db.query("SELECT descriptif FROM cyber where date =" + id, function (err, cyber) {
                                        devCYBER = cyber.map((row) => row.descriptif)
                                        db.query("SELECT descriptif FROM support1 where date =" + id, function (err, s1) {
                                            devSupport1 = s1.map((row) => row.descriptif)
                                            db.query("SELECT descriptif FROM support2 where date =" + id, function (err, s2) {
                                                devSupport2 = s2.map((row) => row.descriptif)
                                                db.query("SELECT descriptif FROM support3 where date =" + id, function (err, s3) {
                                                    devSupport3 = s3.map((row) => row.descriptif)


                                                    const newEmbed = new Discord.MessageEmbed()
                                                        .setColor('RANDOM')
                                                        .setTitle('Devoir pour le ' + id + ':')
                                                        .addFields(
                                                            { name: 'Math :', value: `- ${devMath}`, inline: true },
                                                            { name: 'Français:', value: `- ${devFrançais}`, inline: true },
                                                            { name: 'Anglais :', value: `- ${devAnglais}`, inline: true },
                                                            { name: 'Python :', value: `- ${devPython}`, inline: true },
                                                            { name: 'CEJM :', value: `- ${devCEJM}`, inline: true },
                                                            { name: 'CYBER :', value: `-${devCYBER}`, inline: true },
                                                            { name: 'Support 1 :', value: `-${devSupport1}`, inline: true },
                                                            { name: 'Support 2 :', value: `-${devSupport2}`, inline: true },
                                                            { name: 'Support 3:', value: `-${devSupport3}`, inline: true }

                                                        )
                                                    m.edit(newEmbed)

                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })


                })






            })




        })



    }
})

bot.login('ODM0NDQ0MzIwOTc1MjI0ODcy.YIA-1Q.tL4d_YjC2WjMIlY-yaEoKybNl30')