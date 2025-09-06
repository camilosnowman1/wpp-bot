const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (err) {
        console.error("❌ Error al conectar a MongoDB:", err);
    }
}

module.exports = connectDB;
