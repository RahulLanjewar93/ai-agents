import OpenAI from 'openai';

export class LLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });
  }

  /**
   * Format a message using the LLM
   * @param message The message to format
   * @returns The formatted message
   */
  async formatMessage(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
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

      return response.choices[0]?.message?.content || message;
    } catch (error) {
      console.error('Error formatting message with LLM:', error);
      return message; // Return original message if formatting fails
    }
  }

  /**
   * Classify a message to determine which agent should handle it
   * @param message The message to classify
   * @returns The classification result
   */
  async classifyMessage(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a classification assistant. Based on the user message, determine which category it belongs to: "bug", or "other". Respond with only one word: "bug", "incident", or "other".',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
      });

      const classification = response.choices[0]?.message?.content?.toLowerCase().trim() || 'other';

      // Validate classification
      if (['bug'].includes(classification)) {
        return classification;
      }

      return 'other';
    } catch (error) {
      console.error('Error classifying message with LLM:', error);
      return 'other'; // Default to other if classification fails
    }
  }

  /**
   * Generate a summary of a message
   * @param message The message to summarize
   * @returns The summary
   */
  async generateSummary(message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
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

      return response.choices[0]?.message?.content || 'No summary available';
    } catch (error) {
      console.error('Error generating summary with LLM:', error);
      return 'Error generating summary';
    }
  }
}
