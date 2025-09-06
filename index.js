const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ Bot conectado y escuchando mensajes...");
});

// --- MENSAJES ---
const menu = `👋 *Bienvenido a nuestro servicio* 👋

Escribe el número de la categoría que quieres consultar:

1️⃣ Streaming
2️⃣ Música
3️⃣ Gaming
4️⃣ IA
5️⃣ Programas de PC
`;

const streaming = `🎬 *Streaming*
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
- TeleLatino + Win+ – $15.000
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
`;

const gaming = `🎮 *Gaming*
- Pines Free Fire – $26.000
- Free Fire 520 diamantes 💎 – $26.000
- Xbox Game Pass 1 mes – $25.000
`;

const ia = `🤖 *IA y Herramientas*
- ChatGPT Plus – $35.000
- Canva Pro – $15.000
`;

const pc = `💻 *Programas de PC*
- Office 365 – $60.000 (anual)
- McAfee® – $25.000
`;

// --- BOT ---
client.on("message", msg => {
    const text = msg.body.toLowerCase();

    // Palabras clave que activan el menú
    if (text.includes("hola") || text.includes("info") || text.includes("precio") || text.includes("menú") || text.includes("menu")) {
        msg.reply(menu);
    }

    // Categorías
    else if (text === "1") {
        msg.reply(streaming);
    } 
    else if (text === "2") {
        msg.reply(musica);
    } 
    else if (text === "3") {
        msg.reply(gaming);
    } 
    else if (text === "4") {
        msg.reply(ia);
    } 
    else if (text === "5") {
        msg.reply(pc);
    } 
    
    // Respuesta por defecto si no entiende el mensaje
    else {
        msg.reply("🤖 No entendí tu mensaje. Por favor escribe *hola* o *info* para ver el menú.");
    }
});

client.initialize();
