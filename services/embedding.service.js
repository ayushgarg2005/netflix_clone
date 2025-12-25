// services/embedding.service.js
import { pipeline } from '@xenova/transformers';

class EmbeddingService {
  constructor() {
    this.pipe = null;
  }

  async init() {
    if (!this.pipe) {
      this.pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
  }

  async generate(text) {
    await this.init();
    const output = await this.pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}

export default new EmbeddingService();