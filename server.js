import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './ConnectDB/mongodb.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // to parse JSON request bodies

//Authorization Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});