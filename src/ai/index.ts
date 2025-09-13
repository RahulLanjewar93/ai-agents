import { TriageAgent } from './triage';
import { BugAgent } from './bug';
import { GeneralAgent } from './general';

export async function initializeAgents() {
  // Initialize the triage agent
  const triageAgent = TriageAgent.getInstance();
  const bugAgent = new BugAgent();
  const generalAgent = new GeneralAgent();

  triageAgent.registerAgent('bug', bugAgent);
  triageAgent.registerAgent('general', generalAgent);

  console.log('AI Agents system started successfully');
}
