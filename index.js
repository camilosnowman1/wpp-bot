require("dotenv").config();
const { Client, RemoteAuth } = require("whatsapp-web.js");
const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");
const express = require("express");

(async () => {
    // 🔌 Conexión a MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    const store = new MongoStore({ mongoose });

    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000 // 5 min
        })
    });

    client.on("qr", (qr) => {
        console.log("📲 Escanea este QR para conectar tu bot");
        console.log(qr);
    });

    client.on("ready", () => {
        console.log("🤖 Bot conectado y escuchando mensajes...");
    });

    client.on("message", (msg) => {
        if (msg.body.toLowerCase().includes("hola")) {
            msg.reply("👋 Hola! Soy tu bot con sesión guardada en MongoDB 🚀");
        } else {
            msg.reply("No entendí 🤔, prueba escribiendo *hola*");
        }
    });

    client.initialize();

    // 🌐 Servidor Express para mantener Render activo
    const app = express();
    app.get("/", (req, res) => res.send("🤖 Bot de WhatsApp corriendo con MongoDB Atlas"));
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));
})();
