import { App, LogLevel } from '@slack/bolt';
import type { Agent } from '../types/agent';
import { LLMService } from './llm';

export class SlackService {
  private app: App;
  private triageAgent: Agent;
  private llmService: LLMService;

  constructor(triageAgent: Agent) {
    this.triageAgent = triageAgent;
    this.llmService = new LLMService();

    // Check if required environment variables are set
    if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
      throw new Error('Missing required Slack environment variables');
    }

    // Configure the Slack app based on available environment variables
    const appOptions: any = {
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      logLevel: LogLevel.DEBUG,
    };

    // Add socket mode configuration if app token is provided
    if (process.env.SLACK_APP_TOKEN) {
      appOptions.socketMode = true;
      appOptions.appToken = process.env.SLACK_APP_TOKEN;
    }

    this.app = new App(appOptions);

    this.registerEventListeners();
  }

  /**
   * Start the Slack bot
   */
  async start(): Promise<void> {
    try {
      await this.app.start();
      console.log('Slack bot started successfully');
    } catch (error) {
      console.error('Error starting Slack bot:', error);
    }
  }

  /**
   * Register event listeners for Slack events
   */
  private registerEventListeners(): void {
    // Listen for messages in channels where the bot is mentioned
    this.app.event('app_mention', async ({ event, say }) => {
      try {
        // Process the message with the triage agent
        const response = await this.processMessage(event.text || '');

        // Send response back to Slack
        await say(response.message);
      } catch (error) {
        console.error('Error processing Slack message:', error);
        await say('Sorry, I encountered an error processing your message.');
      }
    });

    // Listen for direct messages
    this.app.message('', async ({ message, say }) => {
      // Skip if this is a message from the bot itself
      if ((message as any).subtype === 'bot_message') return;

      // Check if message has text property
      if (!(message as any).text) return;

      try {
        // Process the message with the triage agent
        const response = await this.processMessage((message as any).text);

        // Send response back to Slack
        await say(response.message);
      } catch (error) {
        console.error('Error processing Slack message:', error);
        await say('Sorry, I encountered an error processing your message.');
      }
    });
  }

  /**
   * Process a message using the triage agent and LLM services
   * @param message The message to process
   * @returns The processed response
   */
  private async processMessage(message: string): Promise<any> {
    // Format the message using the LLM
    const formattedMessage = await this.llmService.formatMessage(message);

    // Process the formatted message with the triage agent
    const agentResponse = await this.triageAgent.processQuery(formattedMessage);

    return agentResponse;
  }
}
