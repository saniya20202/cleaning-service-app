// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Service.deleteMany();
    await Service.insertMany([
      { name: 'Deep Cleaning' },
      { name: 'Carpet Cleaning' },
      { name: 'Window Cleaning' }
    ]);
    console.log('✅ Services seeded');
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
