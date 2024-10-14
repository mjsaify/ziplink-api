import { app } from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./constants.js";

; (async function () {
    try {
        // Connect to the database
        await connectDB();

        // Start the server only if DB connection succeeds
        app.listen(PORT, ()=>{
            console.log("Server running on", PORT);
        })
    } catch (error) {
        console.log("Server Crashed", error);
    }
})();

// Handle runtime server errors after the server has started
app.on("error", (error)=>{
    console.log("Count not start the server", error);
});