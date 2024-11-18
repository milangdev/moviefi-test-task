import mongoose from "mongoose";

/**
 * Connects to the MongoDB database specified in the MONGO_URL environment
 * variable.
 *
 * If the connection is successful, logs a success message to the console.
 * If the connection fails, logs an error message to the console and exits the
 * process.
 *
 * @returns {Promise<void>} - A promise that resolves when the connection is
 * established or fails.
 */
export async function connect() {
  try {
    if (process.env.MONGO_URL) mongoose.connect(process.env.MONGO_URL);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something goes wrong");
    console.log(error);
  }
}
