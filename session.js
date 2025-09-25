const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sessionSchema = new mongoose.Schema({
    name: { type: String, default: 'whatsappSession' },
    sessionData: { type: Object, required: true }
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
