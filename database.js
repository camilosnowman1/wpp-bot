const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/wppbot", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conectado a MongoDB");
    } catch (err) {
        console.error("❌ Error al conectar a MongoDB:", err);
    }
}

module.exports = connectDB;
