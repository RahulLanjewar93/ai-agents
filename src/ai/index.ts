import { SuperAgent } from './super/super';
import { BugAgent } from './bug/bug';
import { GeneralAgent } from './general/general';
import { OrchestratorAgent } from './orchestrator/orchestrator';

export function initializeAgents() {
  const superAgent = SuperAgent.getInstance();

  const agents = [new BugAgent(), new GeneralAgent(), new OrchestratorAgent()];

  for (const agent of agents) {
    superAgent.registerAgent(agent.name, agent);
  }
}
