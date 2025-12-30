import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "HR AI Platform API is running" });
});

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});
