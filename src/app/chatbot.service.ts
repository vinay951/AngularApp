import { AfterViewInit, Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session/session.service';
import { HomeComponent } from './home/home.component';
import { routes as appRoutes } from './app.routes';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

	private apiUrl = 'https://dialogflow.googleapis.com/v2/projects/pizzadelivery-yflisb/agent/sessions/4166c918-747d-e25d-60bc-d3151584f369:detectIntent';
  
	constructor(private http: HttpClient,private route:Router,private session:SessionService) {
		this.initializeRoutesSystemMessage();
	}

	// Initialize system message from application routes at service construction
	private initializeRoutesSystemMessage(): void {
		try {
			const simplified = (appRoutes || []).map(r => ({
				path: (r as any).path ?? null,
				component: ((r as any).component && ((r as any).component as any).name) || null,
				canActivate: (r as any).canActivate ? (r as any).canActivate.map((g: any) => g.name || String(g)) : null
			}));
			const routesContent = JSON.stringify(simplified, null, 2);
			this.sendRoutesSystemMessage(routesContent);
		} catch (e) {
			// if anything fails, just skip attaching the routes system message
		}
	}

	// New: store a system prompt that describes app routes (set by calling sendRoutesSystemMessage)
	private systemMessage: string | null = null;

	// New: call this once with the contents of app.routes.ts (or summarized routes).
	// The system message instructs the model to return a JSON with "route" and "reply".
	sendRoutesSystemMessage(routesContent: string) {
		this.systemMessage = `You are an application assistant aware of the app routes. Routes:\n${routesContent}\n\nWhen the user's question should navigate to a route, respond with a valid JSON object (only the JSON) like: {"route": "/path", "reply": "Helpful answer"}. If no navigation is needed, return: {"route": null, "reply": "Helpful answer"}. The reply field should be user-facing text. Do not include extra text outside the JSON.`;
	}

	sendMessage(message: string): Observable<any> {
		// Build chat messages for the chat service
		const messages: any[] = [];
		if (this.systemMessage) {
			messages.push({ role: 'system', content: this.systemMessage });
		}
		messages.push({ role: 'user', content: message });

		// Get API key from SessionService (caller must ensure it's stored there)
   const apiKey: string = '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'; // Replace with your OpenAI API key
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		});

		const body = {
			model: 'sonar', // adjust model as needed
			messages: messages
		};

		return new Observable(observer => {
			// Call chat service (OpenAI Chat Completions)
			this.http.post<any>('https://api.perplexity.ai/chat/completions', body, { headers }).subscribe({
				next: (res) => {
					const raw = res?.choices?.[0]?.message?.content ?? '';
					let route: string | null = null;
					let reply: string = raw;

					// Try to parse JSON first (preferred - per system instruction)
					try {
						const parsed = JSON.parse(raw);
						if (parsed) {
							if (typeof parsed.reply === 'string') reply = parsed.reply;
							route = parsed.route ?? null;
						}
					} catch (e) {
						// Fallback: try to extract a route with regex and a textual reply
						const routeMatch = raw.match(/"route"\s*:\s*"([^"]+)"|route\s*:\s*'([^']+)'|ROUTE\s*[:=]\s*(\/[^\s"']+)/i);
						if (routeMatch) {
							route = routeMatch[1] ?? routeMatch[2] ?? routeMatch[3] ?? null;
						}
						// Extract reply if JSON-like reply present
						const replyMatch = raw.match(/"reply"\s*:\s*"([^"]+)"/i);
						if (replyMatch) reply = replyMatch[1];
					}

					// If a route is provided, navigate
					if (route) {
						try {
							this.route.navigate([route]);
						} catch (navErr) {
							// ignore navigation errors but include them in returned payload if desired
						}
					}

					observer.next({ route, reply, raw });
					observer.complete();
				},
				error: (err) => {
					observer.error(err);
				}
			});
		});
	}

	// A list of observables (can be any type of observable)
	observablesList: Observable<any> = of('ok').pipe(delay(500));


	// Function to return a random Observable from the list
	// renamed parameter from `reply` to `text` to avoid any accidental free-variable 'reply' references
	getRandomObservable(text: string): Observable<any> {
   
		return of(text).pipe(delay(500));
	}
}

