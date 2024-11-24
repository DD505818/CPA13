export class CloneAssistant {
  private clonedAgents: Map<string, any>;

  constructor() {
    this.clonedAgents = new Map();
  }

  cloneAgent(agent: any): string {
    const clonedAgent = { ...agent, id: this.generateUniqueId() };
    this.clonedAgents.set(clonedAgent.id, clonedAgent);
    return clonedAgent.id;
  }

  getClonedAgentDetails(clonedAgentId: string): any {
    return this.clonedAgents.get(clonedAgentId);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
