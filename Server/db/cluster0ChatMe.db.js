import mongoose from "mongoose";

export const connection1 = async function main() {
  const MONGO_URL = process.env.MONGO_URL;
  await mongoose
    .connect(MONGO_URL)
    .then((res) => {
      console.log("connected");
    })
    .catch((err) => {
      console.log("cant connect" + err);
    });
};
