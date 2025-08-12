import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { requestLogger } from "@common/middlewares/request-logger.middleware"
import { sanitizeRequest } from "@common/middlewares/sanitize.middleware"
import { corsOptions } from "@common/middlewares/cors.middleware"
import { authRouter } from "@modules/auth/auth.route"
const app: express.Application = express()

app.use(cors(corsOptions))
app.use(helmet())
app.use(cookieParser())
app.use(requestLogger)
app.use(sanitizeRequest)
app.use(express.json({limit: "1mb"}))
app.use(express.urlencoded({ extended: true }))
app.use("/api/v1/auth", authRouter)
app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

export default app
