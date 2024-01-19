import { initApp } from "./app";
import { logger } from './components/logger';
import http from "http";
import https from "https";
import fs from 'fs';

const bootstrapServer = async () => {
  const app = await initApp();

  const port = process.env.port ?? 3000;

  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(port, () => {
      logger.info(`server listening on port ${port}`);
    });
  } else {
    console.log('production');
    const options = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem')
    };
    https.createServer(options, app).listen(process.env.HTTPS_PORT);
  }
}

bootstrapServer();
