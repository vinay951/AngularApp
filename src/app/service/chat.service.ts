import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiKey: string = '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'; // Replace with your OpenAI API key

  constructor() {}

  async sendMessage(message: string): Promise<string> {
    let retries = 0;
    const maxRetries = 5;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (retries < maxRetries) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',  // or 'gpt-4' depending on your access
            messages: [{ role: 'user', content: message }],
            max_tokens: 100,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Return the message response
        const reply = response.data.choices[0].message.content.trim();
        return reply;
      } catch (error:any) {
        if (error.response && error.response.status === 429) {
          // Retry logic on hitting rate limit
          retries++;
          const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
          const rateLimitReset = error.response.headers['x-ratelimit-reset'] * 1000;
          const currentTime = Date.now();
          const waitTime = Math.max(rateLimitReset - currentTime, 1000); // Wait until rate limit reset

          console.error(`Rate limit exceeded. Retrying in ${waitTime} ms...`);

          // Wait before retrying (backoff)
          await delay(waitTime);

        } else {
          console.error('Error communicating with OpenAI API:', error);
          throw new Error('Failed to get a response from ChatGPT');
        }
      }
    }

    throw new Error('Max retries exceeded due to rate limits');
  }
}
