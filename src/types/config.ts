export type Config = {
  slack: {
    clientId: string;
    clientSecret: string;
    signingSecret: string;
    stateSecret: string;
    botToken: string;
  };
  openAi: {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  notion: {
    authToken: string;
    databaseId: string;
  };
  server: {
    host: string;
    port: string;
  };
};
