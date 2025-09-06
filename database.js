const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (err) {
        console.error("❌ Error al conectar a MongoDB:", err.message);
        process.exit(1); // salir si no conecta
    }
}

module.exports = connectDB;
