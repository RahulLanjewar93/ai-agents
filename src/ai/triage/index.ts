import type { Agent, AgentResponse } from '../../types/agent';
import { LLMService } from '../../services/llm';

export class TriageAgent implements Agent {
  private agents: Map<string, Agent>;
  private llmService: LLMService;
  private static _instance: TriageAgent;

  private constructor() {
    this.agents = new Map();
    this.llmService = new LLMService();
  }

  public static getInstance(): TriageAgent {
    if (!TriageAgent._instance) {
      TriageAgent._instance = new TriageAgent();
    }
    return TriageAgent._instance;
  }

  /**
   * Register an agent with the triage system
   * @param name The name of the agent
   * @param agent The agent instance
   */
  public registerAgent(name: string, agent: Agent): void {
    this.agents.set(name, agent);
  }

  /**
   * Route a query to the appropriate agent based on content analysis
   * @param query The user query to route
   * @returns The response from the appropriate agent
   */
  async processQuery(query: string): Promise<AgentResponse> {
    // Determine which agent should handle this query
    const targetAgentName = await this.determineTargetAgent(query);

    // Get the target agent
    const targetAgent = this.agents.get(targetAgentName);

    if (!targetAgent) {
      return {
        success: false,
        message: `No agent found for category: ${targetAgentName}`,
        data: 'No agent found',
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
    const classification = await this.llmService.classifyMessage(query);

    // Validate classification
    if (this.agents.has(classification)) {
      return classification;
    }

    // Default to general agent if no specific category is detected
    return 'general';
  }
}
