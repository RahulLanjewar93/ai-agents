const env = process.env;

export const config = {
  slack: {
    botToken: env.SLACK_BOT_TOKEN || '',
    signingSecret: env.SLACK_SIGNING_SECRET || '',
    appToken: env.SLACK_APP_TOKEN || '',
  },
  openAi: {
    apiKey: env.OPENAI_API_KEY || '',
    baseUrl: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: env.OPENAI_MODEL || 'gpt-3.5-turbo',
  },
  notion: {
    authToken: env.NOTION_AUTH_TOKEN || '',
    databaseId: env.NOTION_DATABASE_ID || '',
  },
  server: {
    host: env.HOST || '0.0.0.0',
    port: env.PORT || 1437,
  },
};
