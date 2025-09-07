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
4️⃣ IA y Herramientas  
5️⃣ Programas de PC
`;

    // --- RESPUESTAS POR CATEGORÍA ---
    const streaming = `🎬 *Streaming* ...`; // agrega tu lista completa
    const musica = `🎶 *Música* ...`;
    const gaming = `🎮 *Gaming* ...`;
    const ia = `🤖 *IA y Herramientas* ...`;
    const pc = `💻 *Programas de PC* ...`;

    // --- MENSAJE DE PAGO ---
    const pagoMsg = `💳 *Datos de pago:*  
Nequi o Daviplata: *3015423697*  

📸 Por favor envía el *capture de la transferencia* una vez realizado el pago, y en breve recibirás la cuenta correspondiente ✅`;

    // --- Estado para controlar "no entendí" ---
    const noEntendidoEnviado = new Map();

    // --- BOT ---
    client.on("message", async (msg) => {
        // 🚫 Ignorar mensajes de grupos
        if (msg.isGroup || msg.from.endsWith("@g.us")) return;

        const from = msg.from;
        const text = msg.body.trim().toLowerCase();
        console.log("📩 Mensaje recibido:", text);

        // ✅ Si el cliente envía una imagen (capture de pago)
        if (msg.hasMedia) {
            await msg.reply("✅ Hemos recibido tu *capture de pago*. En breve te enviaremos la cuenta correspondiente. ¡Gracias por tu compra! 🙌");
            noEntendidoEnviado.delete(from); // resetear estado
            return;
        }

        // ✅ Palabras clave que muestran el menú
        if (
            ["hola", "info", "informacion", "información", "menu", "menú", "precio", "pantalla", "pantallas", "servicios"]
                .some(word => text.includes(word))
        ) {
            await msg.reply(menuText);
            noEntendidoEnviado.delete(from);
            return;
        }

        // ✅ Opción por número
        if (text === "1") {
            await msg.reply(streaming);
            await msg.reply(pagoMsg);
            noEntendidoEnviado.delete(from);
            return;
        } else if (text === "2") {
            await msg.reply(musica);
            await msg.reply(pagoMsg);
            noEntendidoEnviado.delete(from);
            return;
        } else if (text === "3") {
            await msg.reply(gaming);
            await msg.reply(pagoMsg);
            noEntendidoEnviado.delete(from);
            return;
        } else if (text === "4") {
            await msg.reply(ia);
            await msg.reply(pagoMsg);
            noEntendidoEnviado.delete(from);
            return;
        } else if (text === "5") {
            await msg.reply(pc);
            await msg.reply(pagoMsg);
            noEntendidoEnviado.delete(from);
            return;
        }

        // ⚠️ Solo mandar "no entendí" una vez por usuario
        if (!noEntendidoEnviado.has(from)) {
            await msg.reply("🤖 No entendí tu mensaje. Escribe *hola*, *info* o *precio* para ver el menú.");
            noEntendidoEnviado.set(from, true);
        }
    });

    client.initialize();

    const app = express();
    app.get("/", (req, res) => res.send("🤖 Bot de WhatsApp corriendo con MongoDB Atlas"));
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));
})();
