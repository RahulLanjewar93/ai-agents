import { OrchestratorAgent } from './orchestrator/agent';
import { BugAgent } from './bug/agent';
import { GeneralAgent } from './general/agent';

export function initializeAgents() {
  const orchestrator = new OrchestratorAgent();

  // Register core agents
  orchestrator.registerAgent('bug', new BugAgent());
  orchestrator.registerAgent('general', new GeneralAgent());
}
