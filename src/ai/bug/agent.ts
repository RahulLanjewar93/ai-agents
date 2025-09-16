import { AgentResponse, BaseAgent } from '../base-agent';

export class BugAgent extends BaseAgent {
  constructor() {
    super('bug-agent', 'Bug Agent', 'Agent for handling bug reports');
  }

  async processQuery(query: string): Promise<AgentResponse> {
    return {
      success: true,
      message: `Processed: ${query}`,
      data: await this.generateResponse(query),
    };
  }
}
