require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const { initializeDatabase } = require('./db/db.connection')
const { Movie } = require('./models/movies.model')

app.use(cors())
app.use(express.json())

initializeDatabase()

app.get("/", (req, res) => {
    res.send("Hello, Express!")
})

app.get("/movies", async (req, res) => {
    try {
        const allMovies = await Movie.find()
        res.json(allMovies)
    } catch (error) {
        res.status(500).json({ error: "Internal server error"})
    }
})

app.post("/movies", async (req, res) => {
    const { movieTitle, director, genre } = req.body

    try {
        const movie = new Movie({ movieTitle, director, genre })
        await movie.save()
        res.status(201).json(movie)
    } catch (error) {
        res.status(500).json({ error: "Internal server error"})
    }
})

app.delete("/movies/:id", async (req, res) => {
    const movieId = req.params.id

    try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId)
        if(!deletedMovie) {
            return res.status(404).json({ error: "Movie not found" })
        }
        res.status(200).json({
            message: "Movie deleted successfully",
            movie: deletedMovie
        })

    } catch (error) {
        res.status(500).json({ error: "Internal server error"})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})