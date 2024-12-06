import { RAGResponse, Document, QueryContext } from './types';
import { VectorStore } from './VectorDB';
import { OllamaService } from './OllamaService';

export class RAGAssistant {
  private vectorStore: VectorStore;
  private ollamaService: OllamaService;
  private contextWindow: number;

  constructor(vectorStore: VectorStore, contextWindow: number = 5) {
    this.vectorStore = vectorStore;
    this.ollamaService = new OllamaService();
    this.contextWindow = contextWindow;
  }

  async query(
    question: string,
    context: QueryContext = {}
  ): Promise<RAGResponse> {
    try {
      // Retrieve relevant documents
      const relevantDocs = await this.vectorStore.search(
        question,
        this.contextWindow
      );

      // Prepare context for the LLM
      const systemPrompt = this.constructSystemPrompt(relevantDocs);

      // Get response from Ollama
      const response = await this.ollamaService.query(
        question,
        context,
        systemPrompt
      );

      return {
        answer: response.answer,
        confidence: response.confidence,
        sources: relevantDocs,
        suggestedActions: response.suggestedActions
      };
    } catch (error) {
      console.error('RAG query failed:', error);
      throw new Error('Failed to process query');
    }
  }

  private constructSystemPrompt(docs: Document[]): string {
    const contextParts = docs.map(
      (doc) => `${doc.metadata.title}:\n${doc.content}`
    );
    
    return `You are an AI assistant with access to the following context:

${contextParts.join('\n\n')}

Please provide accurate and helpful responses based on this context.`;
  }

  async addDocument(doc: Document): Promise<void> {
    try {
      await this.vectorStore.addDocuments([doc]);
    } catch (error) {
      console.error('Failed to add document:', error);
      throw new Error('Document addition failed');
    }
  }

  async clearContext(): Promise<void> {
    try {
      await this.vectorStore.clear();
    } catch (error) {
      console.error('Failed to clear context:', error);
      throw new Error('Context clearing failed');
    }
  }
}