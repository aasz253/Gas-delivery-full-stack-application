const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not set in your .env file.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      console.log(`Dropping collection: ${collection.collectionName}`);
      await collection.drop();
    }

    console.log('All collections dropped. Database is now empty (fresh start).');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error resetting database:', err.message);
    process.exit(1);
  }
};

run();

