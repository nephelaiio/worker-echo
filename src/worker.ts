import { worker } from './echo';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

async function fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const response = await worker(request);
	const { status, content, message } = { status: 200, headers: { 'content-type': 'application/json' } };
	return new Response(JSON.stringify(response, null, 2), {
		status,
		statusText: message,
		headers: { 'content-type': content },
	});
}

export default {
	fetch,
};
