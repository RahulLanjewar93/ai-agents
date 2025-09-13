import OpenAI from 'openai';
import { config } from 'src/config';

export interface AgentResponse<T = string> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: Date;
}

export abstract class BaseAgent<T = string> {
  private id: string;
  public name: string;
  public description: string;
  protected openai: OpenAI;

  constructor(id: string, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.openai = new OpenAI({
      apiKey: config.openAi.apiKey,
      baseURL: config.openAi.baseUrl,
    });
  }

  abstract processQuery(query: string): Promise<AgentResponse<T>>;

  /**
   * Format a message using the LLM
   * @param message The message to format
   * @returns The formatted message
   */
  protected async formatMessage(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that formats and clarifies technical messages. Format the user message to be clear, concise, and well-structured. Extract key information and organize it logically.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content as string;
    } catch (error) {
      console.error('Error formatting message with LLM:', error);
      return message; // Return original message if formatting fails
    }
  }

  /**
   * Generate a summary of a message
   * @param message The message to summarize
   * @returns The summary
   */
  protected async generateSummary(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a summarization assistant. Create a concise summary of the user message, focusing on the key points. Keep it under 100 words.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      return response.choices[0]?.message?.content as string;
    } catch (error) {
      console.error('Error generating summary with LLM:', error);
      return 'Error generating summary';
    }
  }

  /**
   * Generate a response to a message
   * @param message The message to generate a response for
   * @returns The generated response
   */
  protected async generateResponse(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Generate a response to the user message. Keep it under 100 words.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      });

      return response.choices[0]?.message?.content as string;
    } catch (error) {
      console.error('Error generating response with LLM:', error);
      return 'Error generating response';
    }
  }
}
