import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import transactionsRouter from './routes/transactions'
import categoriesRouter from './routes/categories'
import budgetsRouter from './routes/budgets'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.get('/health', (req, res) => {
    res.send('OK')
})

app.use('/api/auth', authRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/budgets', budgetsRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

