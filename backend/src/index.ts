import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/health', (req, res) => {
    res.send('OK')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
