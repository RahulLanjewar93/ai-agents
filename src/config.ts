const env = process.env as any;

export const config = {
  slack: {
    botToken: env.SLACK_BOT_TOKEN,
    signingSecret: env.SLACK_SIGNING_SECRET,
    appToken: env.SLACK_APP_TOKEN,
    clientId: env.SLACK_CLIENT_ID,
    clientSecret: env.SLACK_CLIENT_SECRET,
    stateSecret: env.SLACK_STATE_SECRET,
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
