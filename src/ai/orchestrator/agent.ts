import { config } from 'src/config';
import { AgentResponse, BaseAgent } from '../base-agent';
import { GeneralAgent } from '../general/agent';
import { BugAgent } from '../bug/agent';

interface Task {
  agent: string;
  query: string;
}

interface QueryResponse {
  success: boolean;
  message: string;
  data: string;
}

export class OrchestratorAgent extends BaseAgent<{
  category: string | null;
  confidence: number | null;
}> {
  private agents: Map<string, BaseAgent>;

  constructor() {
    super('orchestrator-agent', 'Orchestrator Agent', 'Unified orchestrator agent');
    this.agents = new Map<string, BaseAgent>();
  }

  public registerAgent(name: string, agent: BaseAgent): void {
    this.agents.set(name, agent);
  }

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
      return { category: 'other', confidence: 1 };
    }
  }

  async processQuery(query: string) {
    // First try to classify and route
    const classification = await this.classifyMessage(query);

    const targetAgent = this.agents.get(classification.category);

    if (targetAgent) {
      const result = await targetAgent.processQuery(query);
      return {
        success: result.success,
        message: result.message,
        data: {
          category: classification.category,
          confidence: classification.confidence,
        },
      };
    }

    return {
      success: true,
      message: 'Processed: ' + query,
      data: {
        category: null,
        confidence: null,
      },
    };
  }
}
