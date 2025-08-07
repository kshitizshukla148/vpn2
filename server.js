import dotenv from 'dotenv';
import { connection } from './config/db.js'; //  Database connection
import app from './index.js'; //  Your Express app

dotenv.config(); //  Load .env variables first

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await connection();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
});
