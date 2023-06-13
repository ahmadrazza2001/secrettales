const app = require("./app");
const dotenv = require("dotenv");
var cloudinary = require("cloudinary").v2;
const connectDatabase = require("./config/database");

//uncaught exception handling
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"})

//database connection
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server running at http://localhost:${process.env.PORT}`)
})

//unhandled promise rejection
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
});