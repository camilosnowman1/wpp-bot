const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");

// --- INICIALIZAR CLIENTE ---
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: "./.wwebjs_auth"
    })
});

// --- QR ---
client.on("qr", qr => {
    console.log("👉 Escanea este QR en tu entorno local. No aparecerá en Render.");
});

// --- READY ---
client.on("ready", () => {
    console.log("✅ Bot conectado y escuchando mensajes...");
});

// --- RESPUESTA DE PRUEBA ---
client.on("message", async msg => {
    const text = msg.body.toLowerCase();

    if (text.includes("hola")) {
        await msg.reply("👋 ¡Hola! El bot en Render está funcionando ✅");
    } else if (text.includes("info")) {
        await msg.reply("ℹ️ Este es un mensaje de prueba desde Render.");
    } else {
        await msg.reply("🤖 No entendí tu mensaje. Escribe *hola* o *info*.");
    }
});

// --- EXPRESS PARA RENDER ---
const app = express();
app.get("/", (req, res) => res.send("🤖 Bot de WhatsApp en Render está activo"));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));

// --- INICIAR BOT ---
client.initialize();
