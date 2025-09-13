import { TriageAgent } from './agents/triage';
import { BugAgent } from './agents/bug';
import { SlackService } from './services/slack';
import express from 'express';
import http from 'http';
import { apiRouter } from './api/routes';
import { config } from './config';

async function main() {
  const app = express();
  const server = http.createServer(app);

  app.use('/api', apiRouter);

  // Initialize the triage agent
  const triageAgent = new TriageAgent();

  // Initialize and register the bug agent
  const bugAgent = new BugAgent();
  triageAgent.registerAgent('bug', bugAgent);

  // Initialize the Slack service
  const slackService = new SlackService(triageAgent);

  // Start the Slack bot
  await slackService.start();
  console.log('AI Agents system started successfully');

  const httpServer = http.createServer(app);
  httpServer.listen(config.server.port, function () {
    console.info('AI Server is running on port ', config.server.port, '.');
  });

  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, (...args) => {
      if (server.listening) {
        server.close((err) => {
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

//handle OS signals for graceful exit

// Start the application
main();
