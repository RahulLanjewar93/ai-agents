// Your Slack event listeners here
import { App, ExpressReceiver } from '@slack/bolt';
import { SuperAgent } from 'src/ai/super/agent';
import { config } from 'src/config';

export const expressReceiver = new ExpressReceiver({
  clientId: config.slack.clientId,
  clientSecret: config.slack.clientSecret,
  signingSecret: config.slack.signingSecret,
  endpoints: {
    events: '/events',
  },
});

const boltApp = new App({
  token: config.slack.botToken,
  receiver: expressReceiver,
});

const superAgent = SuperAgent.getInstance();

boltApp.event('app_mention', async ({ event, say }) => {
  const response = await superAgent.processQuery(event.text);

  await say({
    text: response.data,
    thread_ts: event.ts,
  });
});

boltApp.message('vizmo ai', async ({ message, say }) => {
  console.info('recieved messages');
  await say({
    text: 'This is a threaded reply!',
    thread_ts: message.ts,
  });
});

boltApp.event('app_home_opened', async (args) => {
  console.info('Slack: App home Event');
  const {
    event: { user },
    client,
    say,
    body,
  } = args;

  await say({
    text: `Hi there, you are not the part of Vizmo. Please contact your admin.`,
    channel: user,
  });

  await say({
    text: `Hi ${user}, Thank you for choosing Vizmo. I am Vizmo bot and I will be assisting you with all the notifications related to your workplace visitors.`,
    channel: user,
  });
});
