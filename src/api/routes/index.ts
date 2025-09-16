import { Router } from 'express';
import { slackRouter } from './slack';

export const apiRouter = Router();

apiRouter.use('/slack', slackRouter);
