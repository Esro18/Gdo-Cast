require("dotenv").config();
const TOKEN = process.env.TOKEN;

console.log("Cast Bot Ready");

// ===============================
//        مكتبات ديسكورد
// ===============================
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ]
});

// ===============================
//        دالة التحقق من الأدمن
// ===============================
function isAdmin(member) {
    return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

// ===============================
//        أوامر الشات
// ===============================
client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    const prefix = "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift()?.toLowerCase();

    // ===============================
    //        !اوامر
    // ===============================
    if (cmd === "اوامر") {
        if (!isAdmin(message.member))
            return message.reply("❌ هذا الأمر للادمن فقط.");

        const embed = new EmbedBuilder()
            .setTitle("📌 أوامر البوت")
            .setColor("Blue")
            .addFields(
                { name: "🎤 !كاست @user <رسالة>", value: "إرسال رسالة لشخص." },
                { name: "🎤 !كاست <رسالة>", value: "إرسال رسالة للكل." },
                { name: "🎤 !كاست رتبة @role <رسالة>", value: "إرسال رسالة لرتبة." },
                { name: "🎤 !كاست ايمبد <عنوان | وصف>", value: "إيمبد للكل." },
                { name: "🎤 !كاست ايمبد رتبة @role <عنوان | وصف>", value: "إيمبد لرتبة." },
                { name: "🎤 !كاست ايمبد @user <عنوان | وصف>", value: "إيمبد لشخص." }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }

    // ===============================
    //        !كاست
    // ===============================
    if (cmd === "كاست") {
        if (!isAdmin(message.member))
            return message.reply("❌ هذا الأمر للادمن فقط.");

        // كاست إيمبد لشخص
        if (args[0] === "ايمبد" && message.mentions.users.first()) {
            args.shift();

            const user = message.mentions.users.first();
            args.shift();

            const content = args.join(" ");
            if (!content.includes("|"))
                return message.reply("استخدم:\n!كاست ايمبد @user العنوان | الوصف");

            const [title, desc] = content.split("|").map(t => t.trim());

            const preview = new EmbedBuilder()
                .setTitle(title)
                .setDescription(`${desc}\n\n--------------------\n\n<@${user.id}>`)
                .setColor("Gold");

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirmEmbedUser_${user.id}_${title}_${desc}`)
                    .setLabel("✔️ تأكيد")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancelCast")
                    .setLabel("❌ إلغاء")
                    .setStyle(ButtonStyle.Danger)
            );

            return message.reply({ embeds: [preview], components: [row] });
        }

        // كاست نصي لشخص
        if (message.mentions.users.first() && args[0] !== "ايمبد") {
            const user = message.mentions.users.first();
            args.shift();
            const text = args.join(" ");

            const preview = `📢 **معاينة الكاست للشخص ${user}**\n\n${text}\n\n--------------------\n\n<@${user.id}>`;

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirmUser_${user.id}`)
                    .setLabel("✔️ تأكيد")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancelCast")
                    .setLabel("❌ إلغاء")
                    .setStyle(ButtonStyle.Danger)
            );

            return message.reply({ content: preview, components: [row] });
        }

        // كاست إيمبد للكل
        if (args[0] === "ايمبد" && args[1] !== "رتبة") {
            args.shift();
            const content = args.join(" ");

            if (!content.includes("|"))
                return message.reply("استخدم:\n!كاست ايمبد العنوان | الوصف");

            const [title, desc] = content.split("|").map(t => t.trim());

            const preview = new EmbedBuilder()
                .setTitle(title)
                .setDescription(`${desc}\n\n--------------------\n\n@everyone`)
                .setColor("Gold");

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirmEmbedAll_${title}_${desc}`)
                    .setLabel("✔️ تأكيد")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancelCast")
                    .setLabel("❌ إلغاء")
                    .setStyle(ButtonStyle.Danger)
            );

            return message.reply({ embeds: [preview], components: [row] });
        }

        // كاست إيمبد لرتبة
        if (args[0] === "ايمبد" && args[1] === "رتبة") {
            args.shift();
            args.shift();

            const role = message.mentions.roles.first();
            if (!role) return message.reply("❌ لازم تمنشن رتبة");

            args.shift();
            const content = args.join(" ");

            if (!content.includes("|"))
                return message.reply("استخدم:\n!كاست ايمبد رتبة @role العنوان | الوصف");

            const [title, desc] = content.split("|").map(t => t.trim());

            const preview = new EmbedBuilder()
                .setTitle(title)
                .setDescription(`${desc}\n\n--------------------\n\n<@&${role.id}>`)
                .setColor("Gold");

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirmEmbedRole_${role.id}_${title}_${desc}`)
                    .setLabel("✔️ تأكيد")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancelCast")
                    .setLabel("❌ إلغاء")
                    .setStyle(ButtonStyle.Danger)
            );

            return message.reply({ embeds: [preview], components: [row] });
        }

        // كاست نصي لرتبة
        if (args[0] === "رتبة") {
            args.shift();
            const role = message.mentions.roles.first();
            if (!role) return message.reply("❌ لازم تمنشن رتبة");

            args.shift();
            const text = args.join(" ");

            const preview = `📢 **معاينة لرتبة ${role}**\n\n${text}\n\n--------------------\n\n<@&${role.id}>`;

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirmRole_${role.id}`)
                    .setLabel("✔️ تأكيد")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("cancelCast")
                    .setLabel("❌ إلغاء")
                    .setStyle(ButtonStyle.Danger)
            );

            return message.reply({ content: preview, components: [row] });
        }

        // كاست نصي للكل
        const text = args.join(" ");
        const preview = `📢 **معاينة للكل**\n\n${text}\n\n--------------------\n\n@everyone`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("confirmAll")
                .setLabel("✔️ تأكيد")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("cancelCast")
                .setLabel("❌ إلغاء")
                .setStyle(ButtonStyle.Danger)
        );

        return message.reply({ content: preview, components: [row] });
    }
});

// ===============================
//        التفاعلات (الأزرار)
// ===============================
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    // إلغاء الكاست
    if (interaction.customId === "cancelCast") {
        return interaction.update({
            content: "❌ **تم إلغاء العملية.**",
            components: [],
            embeds: []
        });
    }

    // كاست إيمبد لشخص
    if (interaction.customId.startsWith("confirmEmbedUser_")) {
        const parts = interaction.customId.split("_");
        const userID = parts[1];
        const title = parts[2];
        const desc = parts.slice(3).join(" ");

        const user = await interaction.client.users.fetch(userID);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(`${desc}\n\n--------------------\n\n<@${userID}>`)
            .setColor("Gold");

        try {
            await user.send({
                embeds: [embed],
                content: `--------------------\n\n<@${userID}>`
            });

            return interaction.update({
                content: "✔️ **تم إرسال الإيمبد للشخص بنجاح.**",
                components: []
            });
        } catch {
            return interaction.update({
                content: "❌ **الشخص مقفل الخاص.**",
                components: []
            });
        }
    }

    // كاست نصي لشخص
    if (interaction.customId.startsWith("confirmUser_")) {
        const userID = interaction.customId.split("_")[1];
        const user = await interaction.client.users.fetch(userID);

        const text = interaction.message.content.split("\n\n")[1];

        try {
            await user.send(`${text}\n\n--------------------\n\n<@${userID}>`);

            return interaction.update({
                content: "✔️ **تم إرسال الرسالة للشخص بنجاح.**",
                components: []
            });
        } catch {
            return interaction.update({
                content: "❌ **الشخص مقفل الخاص.**",
                components: []
            });
        }
    }

    // كاست إيمبد للكل
    if (interaction.customId === "confirmAll") {
        const text = interaction.message.content.split("\n\n")[1];

        const members = await interaction.guild.members.fetch();
        let sent = 0;

        for (const m of members.values()) {
            if (m.user.bot) continue;

            try {
                await m.send(`${text}\n\n--------------------\n\n@everyone`);
                sent++;
            } catch {}
        }

        return interaction.update({
            content: `✔️ **تم إرسال الرسالة للكل (${sent}) عضو.**`,
            components: []
        });
    }
});

// ===============================
//        تشغيل البوت
// ===============================
client.on("ready", () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

// ===============================
//        تسجيل الدخول
// ===============================
client.login(TOKEN);