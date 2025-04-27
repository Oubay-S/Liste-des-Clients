const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  nom: { type: String, required: true },
  age: { type: Number, required: true },
});

module.exports = mongoose.model("Client", ClientSchema);