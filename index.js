require("dotenv").config();
const { Client } = require("whatsapp-web.js");
const mongoose = require("mongoose");
const { MongoStore } = require("wwebjs-mongo");

(async () => {
    // 🔌 Conexión a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");

    const store = new MongoStore({ mongoose });

    const client = new Client({
        authStrategy: new (require("whatsapp-web.js").RemoteAuth)({
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
        }
    });

    client.initialize();
})();
