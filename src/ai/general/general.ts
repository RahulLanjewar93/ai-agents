import { AgentResponse, BaseAgent } from '../base-agent';

export class GeneralAgent extends BaseAgent {
  constructor() {
    super('general-agent', 'General Agent', 'General purpose agent');
  }

  async processQuery(query: string): Promise<AgentResponse<string>> {
    return {
      success: true,
      message: `Processed: ${query}`,
      data: await this.generateResponse(query),
    };
  }
}
