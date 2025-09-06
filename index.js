const express = require("express");
const { Client, LocalAuth, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// ==== Servidor Express (Render necesita esto) ====
const app = express();
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => res.send("✅ Bot de WhatsApp activo en Render"));
app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en puerto ${PORT}`));

// ==== Cliente WhatsApp ====
const client = new Client({
    authStrategy: new LocalAuth()
});

// QR en consola
client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
    console.log("📲 Escanea este QR para conectar tu bot");
});

client.on("ready", () => {
    console.log("✅ Bot conectado y escuchando mensajes...");
});

// ==== MENÚ PRINCIPAL (con botones) ====
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

// ==== RESPUESTAS DE CATEGORÍAS ====
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
- NBA League Pass ⭐
`;

const musica = `🎶 *Música*
- Spotify – $13.000
- Deezer – $13.000
- Claro Música – $13.000
- YouTube Premium – $13.000
- Apple Music (1 mes) – $18.000
- Tidal (1 mes) – $13.000
`;

const gaming = `🎮 *Gaming*
- Free Fire 520 diamantes 💎 – $26.000
- Xbox Game Pass 1 mes – $25.000
`;

const ia = `🤖 *IA y Herramientas*
- ChatGPT Plus – $35.000
- Canva Pro – $15.000
- CapCut Pro (30 días) – $23.000
`;

const pc = `💻 *Programas de PC*
- Office 365 (anual) – $60.000
- McAfee® – $25.000
`;

// ==== LÓGICA DEL BOT ====
client.on("message", async msg => {
    const text = msg.body.toLowerCase();
    console.log(`📩 Mensaje de ${msg.from}: ${msg.body}`);

    // Palabras clave que activan el menú
    if (text.includes("hola") || text.includes("info") || text.includes("menu") || text.includes("menú") || text.includes("precio")) {
        await msg.reply(menu);
    }

    // Botones
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

    // Respuesta por defecto
    else {
        await msg.reply("🤖 No entendí tu mensaje. Escribe *hola* o *info* para ver el menú.");
    }
});

// Inicializar cliente
client.initialize();
