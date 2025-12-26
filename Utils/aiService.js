import { pipeline } from '@xenova/transformers';

// Singleton to load the model only once
class EmbeddingService {
  static instance = null;

  static async getInstance() {
    if (!this.instance) {
      // 'feature-extraction' turns text into vectors
      // 'Xenova/all-MiniLM-L6-v2' is a small, fast, highly accurate model
      this.instance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return this.instance;
  }

  static async generateEmbedding(text) {
    const extractor = await this.getInstance();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    // Convert Float32Array to standard JS Array for MongoDB
    return Array.from(output.data);
  }
}

export default EmbeddingService;