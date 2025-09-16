import express from 'express';
import http from 'http';
import { apiRouter } from './api/routes';
import { config } from './config';
import { initializeAgents } from './ai';
import morgan from 'morgan';

async function main() {
  const app = express();

  // Middlewares
  app.use(morgan('tiny'));
  app.use('/api', apiRouter);

  // Health check
  app.get('/health', (req, res) => {
    res.send({ status: 'ok' }).status(200);
  });

  initializeAgents();

  const httpServer = http.createServer(app);
  httpServer.listen(config.server.port, function () {
    console.info(`AI Server is running on port ${config.server.port}`);
  });

  //handle OS signals for graceful exit
  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, (...args) => {
      if (httpServer.listening) {
        httpServer.close((err) => {
          console.log('Could not close http server gracefully', err);
        });
      }
      // print uncaught exceptions to stderr
      if (eventType === 'uncaughtException') {
        console.log(`Caught exception: ${args[0]}\n` + `Exception origin: ${args[1]}`);
      }

      if (eventType !== 'exit') process.exit();
    });
  });
}

// Start the application
main();
