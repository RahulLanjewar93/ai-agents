import { Router } from 'express';

export const slackRouter = Router();

slackRouter.post('/', (req, res) => {
  console.log('', req.body);
  res.sendStatus(200);
});
