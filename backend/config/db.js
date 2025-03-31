Aconst mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6 deprecated these options, but keeping them commented
      // in case older versions are used or for reference.
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true, // No longer needed
      // useFindAndModify: false // No longer needed
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;