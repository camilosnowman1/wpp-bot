const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");

// Configurar cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

// QR
client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

// Listo
client.on("ready", () => {
    console.log("✅ Bot conectado y escuchando mensajes...");
});

// Responder texto plano
client.on("message", async msg => {
    console.log(`📩 Mensaje de ${msg.from}: ${msg.body}`);
    await msg.reply("👋 Hola! Soy un bot de prueba en Render.");
});

// Servidor Express para Render
const app = express();
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => res.send("✅ Bot activo en Render"));
app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));

client.initialize();
