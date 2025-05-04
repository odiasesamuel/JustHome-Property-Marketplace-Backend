import app from "./app";
import { connectToDatabase } from "./config/db.config";

const PORT = process.env.PORT || 5000;

connectToDatabase(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
