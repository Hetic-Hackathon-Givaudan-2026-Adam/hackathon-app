import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`API Givaudan sur http://localhost:${PORT}/api`);
  console.log(
    !process.env.ANTHROPIC_API_KEY || process.env.DEMO === "1"
      ? "Assistant : mode DÉMO (réponses scénarisées)"
      : "Assistant : Claude, avec repli démo en cas d'erreur"
  );
});
