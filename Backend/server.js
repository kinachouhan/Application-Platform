
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://applicationplatform.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, 
  })
);




app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/customer", customerRoutes);



app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
