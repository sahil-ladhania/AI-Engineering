import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`Synapse backend running on port ${env.PORT}`);
});
