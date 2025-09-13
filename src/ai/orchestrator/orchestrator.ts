import { AgentResponse, BaseAgent } from '../base-agent';

export class OrchestratorAgent extends BaseAgent {
  constructor() {
    super('orchestrator-agent', 'Orchestrator Agent', 'Orchestrator agent');
  }

  processQuery(query: string): Promise<AgentResponse<string>> {
    throw new Error('Method not implemented.');
  }
}
