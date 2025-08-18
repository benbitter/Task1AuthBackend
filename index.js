import { httpServer } from "./app.js";
import { connectDb } from "./db/index.js";

const port = process.env.PORT || 3001;

connectDb().then(

    () => httpServer.listen(port, () => console.log(`Server is running on port ${port}`))
).catch((error) => {
    console.error("Error connecting to the database:", error);
});
