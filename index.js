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
2️⃣ Música y Audio  
3️⃣ Gaming  
4️⃣ Inteligencia Artificial y Herramientas  
5️⃣ Programas de PC
`;

    // --- RESPUESTAS POR CATEGORÍA ---
    const streaming = `🎬 *Streaming*
👋 ¡Bienvenido! Gracias por comunicarte con nosotros.
Aquí tienes nuestra lista de servicios y precios:

- Amazon Prime – $15.000
- HBO Max – $15.000
- Netflix – $15.000
- Disney+ – $15.000
- Apple TV+ – $15.000
- Star+ – $15.000
- Paramount+ – $14.000
- Crunchyroll – $14.000
- MagisTV – $12.500
- IPTV Premium – $15.000
- TeleLatino Completa con Win+ – $15.000
- Pornhub +18 – $15.000
- DirecTVGO + Win Sports – $14.000
- NBA League Pass ⭐ – (precio)
`;

    const musica = `🎶 *Música y Audio*
- Spotify – $13.000
- Deezer – $13.000
- Claro Música – $13.000
- YouTube Premium – $13.000
`;

    const gaming = `🎮 *Gaming*
- Pines Free Fire – $26.000
- Free Fire 520 diamantes 💎 – $26.000
- Xbox Game Pass 1 mes – $25.000
`;

    const ia = `🤖 *Inteligencia Artificial y Herramientas*
- ChatGPT Plus – $35.000
- Gemini AI Pro – $35.000
- Canva Pro – $15.000
`;

    const pc = `💻 *Programas de PC*
- Office 365 – $60.000 (anual)
- McAfee® – $25.000
`;

    // --- MENSAJE DE PAGO ---
    const pagoMsg = `💳 *Datos de pago:*  
Nequi o Daviplata: *3015423697*  

📸 Por favor envía el *capture de la transferencia* una vez realizado el pago, y en breve recibirás la cuenta correspondiente ✅`;

    // --- Estado para controlar "no entendí" ---
    const noEntendidoEnviado = new Map();

    // --- BOT ---
    client.on("message", async (msg) => {
        if (msg.isGroup || msg.from.endsWith("@g.us")) return; // 🚫 Ignorar grupos
        if (msg.type === "ptt" || msg.type === "audio") return; // 🚫 Ignorar notas de voz

        const from = msg.from;
        const text = (msg.body || "").trim().toLowerCase();
        console.log("📩 Mensaje recibido:", text);

        if (msg.hasMedia) {
            await msg.reply("✅ Hemos recibido tu *capture de pago*. En breve te enviaremos la cuenta correspondiente. ¡Gracias por tu compra! 🙌");
            noEntendidoEnviado.delete(from);
            return;
        }

        if (["hola", "info", "informacion", "información", "menu", "menú", "precio", "pantalla", "pantallas", "servicios"]
            .some(word => text.includes(word))) {
            await msg.reply(menuText);
            noEntendidoEnviado.delete(from);
            return;
        }

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
            await msg.reply(ia);
            await msg.reply(pagoMsg);
        } else if (text === "5") {
            await msg.reply(pc);
            await msg.reply(pagoMsg);
        } else {
            if (!noEntendidoEnviado.has(from)) {
                await msg.reply("🤖 No entendí tu mensaje. Escribe *hola*, *info* o *precio* para ver el menú.");
                noEntendidoEnviado.set(from, true);
            }
        }
    });

    client.initialize();

    const app = express();
    app.get("/", (req, res) => res.send("🤖 Bot de WhatsApp corriendo con MongoDB Atlas"));
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));
})();
