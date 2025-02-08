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

    // Initialize a message history array to track the conversation
    let messagesHistory = [{ role: 'user', content: message }];
    
    while (retries < maxRetries) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',  // or 'gpt-4' depending on your access
                    messages: messagesHistory,  // Pass the entire conversation context here
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

            // Get the response and append it to the messagesHistory for the next iteration
            const reply = response.data.choices[0].message.content.trim();
            messagesHistory.push({ role: 'assistant', content: reply }); // Save assistant's response to the conversation history
            
            return reply;
        } catch (error: any) {
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
