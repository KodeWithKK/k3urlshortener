import { app } from './app.js';
import connectDB from './db/index.js';

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  })
})
.catch((err) => {
  // wasse ye kabhi bhi execute nhi hoga kyuki connectDb() ma phele se hi error handling krli ha
  console.log("MongoDB connection Failed !!!", err);
})
