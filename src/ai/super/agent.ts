import { config } from 'src/config';
import { BaseAgent, AgentResponse } from '../base-agent';

export class SuperAgent extends BaseAgent {
  private agents: Map<string, BaseAgent>;
  private static _instance: SuperAgent;

  private constructor() {
    super('super-agent', 'Super Agent', 'Centralized agent coordination system');
    this.agents = new Map<string, BaseAgent>();
  }

  public static getInstance(): SuperAgent {
    if (!SuperAgent._instance) {
      SuperAgent._instance = new SuperAgent();
    }
    return SuperAgent._instance;
  }

  /**
   * Register an agent with the triage system
   * @param name The name of the agent
   * @param agent The agent instance
   */
  public registerAgent(name: string, agent: BaseAgent): void {
    this.agents.set(name, agent);
  }

  /**
   * Classify a message to determine which agent should handle it
   * @param message The message to classify
   * @returns The classification result
   */
  protected async classifyMessage(message: string): Promise<{ category: string; confidence: number }> {
    try {
      const response = await this.openai.chat.completions.create({
        model: config.openAi.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a classification assistant.' +
              'Based on the user message, determine which category it belongs to: "bug", "general", "mix" or "other".' +
              'Respond in JSON format. Example: { "category": "bug", confidence: 0.8 }',
          },
          {
            role: 'user',
            content: 'Someone is facing issue with whatsapp notifications',
          },
          {
            role: 'assistant',
            content: '{ "category": "bug", confidence: 0.9 }',
          },
          {
            role: 'user',
            content: 'Client Microsoft is not able to login to portal',
          },
          {
            role: 'assistant',
            content: '{ "category": "bug", confidence: 0.8 }',
          },
          {
            role: 'user',
            content: 'How is the weather today?',
          },
          {
            role: 'assistant',
            content: '{ "category": "general", confidence: 0.8 }',
          },
          {
            role: 'user',
            content: 'How is the weather? Someone from microsoft called, seems like app is not working',
          },
          {
            role: 'assistant',
            content: '{ "category": "mix", confidence: 0.6 }',
          },
          {
            role: 'user',
            content: 'I need to buy a new car',
          },
          {
            role: 'assistant',
            content: '{ "category": "other", confidence: 0.6 }',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.1,
        max_tokens: 10,
        response_format: {
          type: 'json_object',
        },
      });

      const parsedResponse = JSON.parse(response.choices[0]?.message?.content as string);
      return parsedResponse;
    } catch (error) {
      console.error('Error classifying message with LLM:', error);
      return { category: 'other', confidence: 1 }; // Default to other if classification fails
    }
  }

  /**
   * Route a query to the appropriate agent based on content analysis
   * @param query The user query to route
   * @returns The response from the appropriate agent
   */
  async processQuery(query: string): Promise<AgentResponse<string>> {
    // Determine which agent should handle this query
    const targetAgentName = await this.determineTargetAgent(query);

    // Get the target agents
    const targetAgent = this.agents.get(targetAgentName);

    if (!targetAgent) {
      return {
        success: false,
        message: `No agent found for category: ${targetAgentName}`,
        data: "Sorry I don't know how to handle that.",
      };
    }

    // Process the query with the target agent
    return await targetAgent.processQuery(query);
  }

  /**
   * Determine which agent should handle a given query
   * @param query The query to analyze
   * @returns The name of the agent that should handle this query
   */
  private async determineTargetAgent(query: string): Promise<string> {
    // Use the LLM service to classify the query
    const classification = await this.classifyMessage(query);

    // If confidence is low, default to "other"
    if (classification.confidence < 0.5) {
      return 'other';
    }

    // Validate classification
    if (this.agents.has(classification.category)) {
      return classification.category;
    }

    // Default to "other" if classification fails
    return 'other';
  }
}
