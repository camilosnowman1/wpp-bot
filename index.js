require("dotenv").config();
const { Client, RemoteAuth } = require("whatsapp-web.js");
const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");
const express = require("express");
const qrcode = require("qrcode-terminal");

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (err) {
        console.error("❌ Error al conectar a MongoDB:", err);
        return;
    }

    const store = new MongoStore({ mongoose });

    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000,
        }),
        puppeteer: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
    });

    client.on("qr", (qr) => {
        console.log("📲 Escanea este QR para conectar tu bot");
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
        console.log("🤖 Bot conectado y escuchando mensajes...");
    });

    // --- MENÚ PRINCIPAL ---
    const menuText = `👋 *Bienvenido a nuestro servicio* 👋

Escribe el número de la categoría que quieras:

1️⃣ Streaming  
2️⃣ Música  
3️⃣ Gaming  
4️⃣ AI y Herramientas  
5️⃣ Programas de PC
`;

    // --- RESPUESTAS POR CATEGORÍA ---
    const streaming = `🎬 *Streaming*
- Amazon Prime – $15.000
- HBO Max – $15.000
- Netflix – $15.000
- Disney+ – $15.000
- Disney Estándar – $10.000
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

    const ai = `🤖 *AI y Herramientas*
- ChatGPT Plus – $35.000
- Gemini AI Pro – $35.000
- Canva Pro – $15.000
- CapCut Pro (30 días) – $23.000`;

    const pc = `💻 *Programas de PC*
- Office 365 (anual) – $60.000
- McAfee® – $25.000`;

    // --- MENSAJE DE PAGO ---
    const pagoMsg = `💳 *Datos de pago:*  
Nequi o Daviplata: *3015423697*  

📸 Por favor envía el *capture de la transferencia* una vez realizado el pago, breve recibirás la cuenta correspondiente ✅`;

    // --- BOT ---
    client.on("message", async (msg) => {
        const text = msg.body.trim().toLowerCase();
        console.log("📩 Mensaje recibido:", text);

        // ✅ Palabras clave que muestran el menú
        if (
            ["hola", "info", "informacion", "información", "menu", "menú", "precio", "pantalla", "pantallas", "servicios"]
                .some(word => text.includes(word))
        ) {
            await msg.reply(menuText);
            return;
        }

        // ✅ Opción por número
        if (text === "1") {
            await msg.reply(streaming);
            await msg.reply(pagoMsg);
        } else if (text === "2") {
            await msg.reply(musica);
            await msg.reply(pagoMsg);
        } else if (text === "3") {
            await msg.reply(gaming);
            await msg.reply(pagoMsg);
        } else if (text === "4") {
            await msg.reply(ai);   // 🔥 Corregido: antes estaba "ia"
            await msg.reply(pagoMsg);
        } else if (text === "5") {
            await msg.reply(pc);
            await msg.reply(pagoMsg);
        } else {
            await msg.reply("🤖 No entendí tu mensaje. Escribe *hola*, *info* o *precio* para ver el menú.");
        }
    });

    client.initialize();

    const app = express();
    app.get("/", (req, res) => res.send("🤖 Bot de WhatsApp corriendo con MongoDB Atlas"));
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));
})();
