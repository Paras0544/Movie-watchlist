require('dotenv').config(); // Load environment variables from .env file
import axios from "axios"; // Import axios for making HTTP requests
const Movie = require('./models/Movie');  // Import the Movie model from the models directory
const path = require('path'); // Node.js module for handling file paths 
const express = require('express'); // express framework for building web applications
const mongoose = require('mongoose'); // MongoDB object modeling tool as mongoose is used to interact with MongoDB database

const app = express(); // Create an instance of the Express application
const PORT = 3000;


mongoose.connect(process.env.MONGODB_URI) // Connect to MongoDB using the URI from environment variables
  .then(() => { console.log('Connected to MongoDB'); }) // runs if successful
  .catch((err) => { console.error('Error connecting to MongoDB:', err); }); // runs if there's an error

  app.set('view engine', 'ejs'); // Set EJS as the templating engine
  app.set('views', path.join(__dirname, 'views')); // Set the directory for EJS templates
  app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form submissions)

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

  app.get('/', async (req,res) =>{
    try {
      const movies = await Movie.find(); // Fetch all movies from the database
      res.render('index.ejs', { movies }); // Render the index.ejs template with the movies data
    }
    catch(err){
      console.error('Error fetching movies:', err); // Log any errors that occur during fetching
      res.status(500).send('Internal Server Error'); // Send a 500 response if there's an error
    }
  });

  app.post("/search-movie", async (req, res) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${req.body.searchQuery}&apikey=${process.env.OMDB_API_KEY}`); // Make a GET request to the OMDB API with the search query
      res.render("search.ejs", { movies: response.data.Search || [] }); // Render the search.ejs template with the search results
    }
    catch(err){
      console.error("failed to search movies:", err); // Log any errors that occur during the search
      res.status(500).send("Internal Server Error"); // Send a 500 response if there's an error
    }
  }) 

  app.post("/save-movie", async (req, res) => {
    try {
      const {title, year, poster, imdbID} = req.body; // Destructure movie details from the request body
      const newMovie = new Movie({ title, year, poster, imdbID }); // Create a new Movie instance with the provided details
      await newMovie.save(); // Save the new movie to the database
      res.redirect("/"); // Redirect to the home page after saving
    }
    catch(err){
      console.error("failed to save movie:", err); // Log any errors that occur during saving
      res.status(500).send("Internal Server Error"); // Send a 500 response if there's an error
    }
  })