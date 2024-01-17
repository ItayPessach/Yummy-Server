import { initApp } from "./app";
import { logger } from './components/logger';

const bootstrapServer = async () => {
  const app = await initApp();

  const port = process.env.port ?? 3000;

  app.listen(port, () => {
    logger.info(`server listening on port ${port}`);
  });
}

bootstrapServer();
