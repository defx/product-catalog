import app from "./app";

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(
    `📝 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`
  );
});
