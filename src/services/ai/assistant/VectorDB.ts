import { Document, VectorStore, EmbeddingResult } from './types';

export class VectorDB implements VectorStore {
  private documents: Map<string, Document>;
  private embeddings: Map<string, number[]>;

  constructor() {
    this.documents = new Map();
    this.embeddings = new Map();
  }

  async addDocuments(documents: Document[]): Promise<void> {
    for (const doc of documents) {
      const embedding = await this.generateEmbedding(doc.content);
      this.documents.set(doc.id, doc);
      this.embeddings.set(doc.id, embedding.vector);
    }
  }

  async search(query: string, limit: number = 5): Promise<Document[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    
    // Calculate similarities and sort documents
    const similarities = Array.from(this.embeddings.entries()).map(
      ([id, vector]) => ({
        id,
        similarity: this.cosineSimilarity(queryEmbedding.vector, vector)
      })
    );

    const topResults = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return topResults
      .map((result) => this.documents.get(result.id))
      .filter((doc): doc is Document => doc !== undefined);
  }

  async delete(documentId: string): Promise<void> {
    this.documents.delete(documentId);
    this.embeddings.delete(documentId);
  }

  async clear(): Promise<void> {
    this.documents.clear();
    this.embeddings.clear();
  }

  private async generateEmbedding(text: string): Promise<EmbeddingResult> {
    // Simplified embedding generation - in production use a proper embedding model
    const vector = new Array(384).fill(0).map(() => Math.random());
    return { vector, text };
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}