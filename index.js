import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import propertyRouter from './routes/property.route.js';
import investorRouter from './routes/investor.route.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads'); // Define the destination folder for uploads
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Define the filename
//   },
// });

// const upload = multer({ storage });

mongoose.connect(process.env.MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(err);
});

const app = express();

app.use(cookieParser());
app.use(express.json());

// Serve static files
app.use(express.static(resolve(__dirname, "client", "build")));

// Define API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/property', propertyRouter);
app.use('/api/investor', investorRouter);

// // Handle file uploads
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   // Handle file upload processing here
//   res.json({ success: true, message: 'File uploaded successfully' });
// });

// Catch-all route to serve React app
app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "client", "build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
