const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

const movieSchema = new mongoose.Schema({
    title: String,
    year: String,
    poster: String,
    imdbID: String
});

module.exports = mongoose.model('Movie', movieSchema);