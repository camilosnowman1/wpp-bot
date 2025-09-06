const { Client, Buttons, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// --- CLIENTE ---
const client = new Client({
    authStrategy: new LocalAuth() // Sesión persistente
});

// --- QR ---
client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
    console.log("📲 Escanea este QR para iniciar sesión");
});

client.on("ready", () => {
    console.log("✅ Bot conectado y escuchando mensajes...");
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
const streaming = new Buttons(
    `🎬 *Streaming*
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
- NBA League Pass ⭐`,
    [{ body: "⬅️ Volver al Menú" }]
);

const musica = new Buttons(
    `🎶 *Música*
- Spotify – $13.000
- Deezer – $13.000
- Claro Música – $13.000
- YouTube Premium – $13.000
- Apple Music (1 mes) – $18.000
- Tidal (1 mes) – $13.000`,
    [{ body: "⬅️ Volver al Menú" }]
);

const gaming = new Buttons(
    `🎮 *Gaming*
- Free Fire 520 diamantes 💎 – $26.000
- Xbox Game Pass 1 mes – $25.000`,
    [{ body: "⬅️ Volver al Menú" }]
);

const ia = new Buttons(
    `🤖 *IA y Herramientas*
- ChatGPT Plus – $35.000
- Canva Pro – $15.000
- CapCut Pro (30 días) – $23.000`,
    [{ body: "⬅️ Volver al Menú" }]
);

const pc = new Buttons(
    `💻 *Programas de PC*
- Office 365 (anual) – $60.000
- McAfee® – $25.000`,
    [{ body: "⬅️ Volver al Menú" }]
);

// --- BOT ---
client.on("message", async msg => {
    console.log(`📩 Mensaje de ${msg.from}: ${msg.body}`); // Log en consola
    const text = msg.body;

    // Palabras clave que activan el menú
    if (["hola", "info", "menú", "menu", "precio"].some(word => text.toLowerCase().includes(word))) {
        await msg.reply(menu);
    }

    // Botones principales
    else if (text === "🎬 Streaming") await msg.reply(streaming);
    else if (text === "🎶 Música") await msg.reply(musica);
    else if (text === "🎮 Gaming") await msg.reply(gaming);
    else if (text === "🤖 IA y Herramientas") await msg.reply(ia);
    else if (text === "💻 Programas de PC") await msg.reply(pc);

    // Botón volver
    else if (text === "⬅️ Volver al Menú") {
        await msg.reply(menu);
    }

    // Respuesta por defecto
    else {
        await msg.reply("🤖 No entendí tu mensaje. Escribe *hola* o *info* para ver el menú.");
    }
});

// --- MANEJO DE ERRORES ---
process.on("unhandledRejection", (reason, p) => {
    console.error("🚨 Error no manejado:", reason);
});

client.initialize();

// --- Servidor web falso para Render ---
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("🤖 Bot de WhatsApp corriendo en Render ✅");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🌐 Servidor web escuchando en puerto " + (process.env.PORT || 3000));
});

