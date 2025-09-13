import { Config } from 'src/types/config';

const env = process.env as any;

export const config: Config = {
  slack: {
    clientId: env.SLACK_CLIENT_ID,
    clientSecret: env.SLACK_CLIENT_SECRET,
    signingSecret: env.SLACK_SIGNING_SECRET,
    stateSecret: env.SLACK_STATE_SECRET,
    botToken: env.SLACK_BOT_TOKEN,
  },
  openAi: {
    apiKey: env.OPENAI_API_KEY,
    baseUrl: env.OPENAI_BASE_URL,
    model: env.OPENAI_MODEL,
  },
  notion: {
    authToken: env.NOTION_AUTH_TOKEN,
    databaseId: env.NOTION_DATABASE_ID,
  },
  server: {
    host: env.HOST,
    port: env.PORT,
  },
};
