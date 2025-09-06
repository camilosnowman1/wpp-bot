require("dotenv").config();
const { Client, RemoteAuth, Buttons } = require("whatsapp-web.js");
const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");
const express = require("express");

(async () => {
    // 🔌 Conexión a MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    const store = new MongoStore({ mongoose });

    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000, // cada 5 min
        })
    });

    // --- EVENTOS DEL BOT ---
    client.on("qr", (qr) => {
        console.log("📲 Escanea este QR para conectar tu bot");
        console.log(qr);
    });

    client.on("ready", () => {
        console.log("🤖 Bot conectado y escuchando mensajes...");
    });

    // --- MENÚ PRINCIPAL ---
    const menu = new Buttons(
        "👋 *Bienvenido a nuestro servicio* 👋\n\nSelecciona una categoría:",
        [
            { body: "🎬 Streaming" },
            { body: "🎶 Música" },
            { body: "🎮 Gaming" },
            { body: "🤖 IA y Herramientas" },
            { body: "💻 Programas de PC" }
        ],
        "📋 Menú Principal",
        "Toca un botón para continuar"
    );

    // --- RESPUESTAS POR CATEGORÍA ---
    const streaming = `🎬 *Streaming*
- Amazon Prime – $15.000
- HBO Max – $15.000
- Netflix – $15.000
- Disney+ – $15.000
- Disney Estándar (genérico 1P) – $10.000
- Apple TV+ – $15.000
- Star+ – $15.000
- Paramount+ – $14.000
- Crunchyroll – $14.000
- MagisTV – $12.500
- IPTV Premium – $15.000
- TeleLatino + Win+ – $15.000
- El Profe Net + Win+ (30 días) – $13.000
- Plex cuenta completa (30 días) – $20.000
- Universal+ (1 pantalla, 30 días) – $13.000
- Claro Video (30 días Win+) – $17.000
- Viki Rakuten Doramas – $12.000
- MUBI pantalla – $13.000
- Movistar TV Play CO – $17.000
- Jellyfin pantalla – $14.000
- Pornhub +18 – $15.000
- DirecTVGO + Win Sports – $14.000
- Vix+ – $13.000
- NBA League Pass ⭐`;

    const musica = `🎶 *Música*
- Spotify – $13.000
- Deezer – $13.000
- Claro Música – $13.000
- YouTube Premium – $13.000
- Apple Music (1 mes) – $18.000
- Tidal (1 mes) – $13.000`;

    const gaming = `🎮 *Gaming*
- Free Fire 520 diamantes 💎 – $26.000
- Xbox Game Pass 1 mes – $25.000`;

    const ia = `🤖 *IA y Herramientas*
- ChatGPT Plus – $35.000
- Canva Pro – $15.000
- CapCut Pro (30 días) – $23.000`;

    const pc = `💻 *Programas de PC*
- Office 365 (anual) – $60.000
- McAfee® – $25.000`;

    // --- BOT ---
    client.on("message", async msg => {
        const text = msg.body.toLowerCase();

        // Palabras clave para mostrar menú
        if (text.includes("hola") || text.includes("info") || text.includes("menu") || text.includes("menú") || text.includes("precio")) {
            await msg.reply(menu);
        }

        // Respuestas a botones
        else if (text === "🎬 Streaming") {
            await msg.reply(streaming);
            await msg.reply(menu);
        } else if (text === "🎶 Música") {
            await msg.reply(musica);
            await msg.reply(menu);
        } else if (text === "🎮 Gaming") {
            await msg.reply(gaming);
            await msg.reply(menu);
        } else if (text === "🤖 IA y Herramientas") {
            await msg.reply(ia);
            await msg.reply(menu);
        } else if (text === "💻 Programas de PC") {
            await msg.reply(pc);
            await msg.reply(menu);
        }

        // Default si no entiende
        else {
            await msg.reply("🤖 No entendí tu mensaje. Escribe *hola* o *info* para ver el menú.");
        }
    });

    client.initialize();

    // 🌐 Servidor Express para Render
    const app = express();
    app.get("/", (req, res) => res.send("🤖 Bot de WhatsApp corriendo con MongoDB Atlas"));
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));
})();
