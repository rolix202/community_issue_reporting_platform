import express from "express"
const app = express()
import logger from "morgan"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"


import issuesRoute from "./routes/issuesRoute.js"

const db = process.env.NODE_ENV === "development" ? process.env.MONGO_LOCAL_URI : process.env.MONGO_LIVE_URI

async function main(){
    const conn = mongoose.connect(db)

    if (conn) console.log("Database successfully connected!");
}

main().catch((err) => console.error(err))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(logger("dev"))
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/api/v1/issues", issuesRoute)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Sever running on port - ${port}`);
    
})
