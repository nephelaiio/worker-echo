import type { Request as NodeRequest } from 'http';

type WorkerRequest = Request;
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type EchoResponse = {
	status: number;
	text: string;
	content: string;
	message: string;
	url: string;
	origin: string;
	hostname: string;
	protocol: string;
	port: string;
	path: string;
	search: string;
	method: string;
	redirect: string;
	headers: Record<string, string>;
	params: Record<string, string>;
	body: any;
	cloudflare?: {
		asn: number;
		asOrganization: string;
		botManagemenet?: {
			score: number;
			verifiedBot: boolean;
			static_resource: string;
			ja3Hash: string;
			detectionIds: any;
		};
		colo: string;
		country: string | null;
		isEUCountry: boolean;
		httpProtocol: string;
		requestPriority: string;
		tlsCipher: string;
		tlsVersion: string;
		city?: string;
		contintent?: string;
		latitude?: string;
		longitude?: string;
		postalCode?: string;
		region?: string;
		regionCode?: string;
		timezone: string;
	};
	node?: {
		remoteAddress: string;
		remotePort: number;
	};
};

async function worker(request: WorkerRequest): Promise<EchoResponse> {
	const url = new URL(request.url);
	const headers: Record<string, string> = Object.fromEntries(request.headers.entries());
	const params: Record<string, string> = Object.fromEntries(url.searchParams.entries());
	const header = (k: string): string | null => (k in headers ? headers[k].toLowerCase() : null);

	const isWebsocket = header('upgrade') === 'websocket';
	const isJson = header('content-type') === 'application/json';
	const body = isJson ? await request.json() : await request.text();
	const cfInfo = request.cf;
	let botManagement = {};
	if (cfInfo.botManagement !== undefined) {
		botManagement = {
			botManagement: {
				score: cfInfo.botManagement.score,
				verifiedBot: cfInfo.botManagement.verifiedBot,
				static_resource: cfInfo.botManagement.static_resource,
				ja3Hash: cfInfo.botManagement.ja3Hash,
				detectionIds: cfInfo.botManagement.detectionIds,
			},
		};
	}
	const cloudflare = {
		...botManagement,
		...{
			asn: cfInfo.asn,
			asOrganization: cfInfo.asOrganization,
			colo: cfInfo.colo,
			country: cfInfo.country,
			isEUCountry: cfInfo.isEUCountry,
			httpProtocol: cfInfo.httpProtocol,
			requestPriority: cfInfo.requestPriority,
			tlsCipher: cfInfo.tlsCipher,
			tlsVersion: cfInfo.tlsVersion,
			city: cfInfo.city ?? undefined,
			contintent: cfInfo.contintent ?? undefined,
			latitude: cfInfo.latitude ?? undefined,
			longitude: cfInfo.longitude ?? undefined,
			postalCode: cfInfo.postalCode ?? undefined,
			region: cfInfo.region ?? undefined,
			regionCode: cfInfo.regionCode ?? undefined,
			timezone: cfInfo.timezone,
		},
	};

	const response = {
		content: 'application/json',
		url: request.url,
		origin: url.origin,
		hostname: url.hostname,
		protocol: url.protocol,
		port: url.port,
		path: url.pathname,
		search: url.search,
		method: request.method,
		redirect: request.redirect,
		headers,
		params,
		body,
		cloudflare,
	};

	if (isWebsocket) {
		return { ...response, ...{ status: 400, text: 'Websocket requests are not supported' } };
	} else {
		return { ...response, ...{ status: 200, text: 'OK' } };
	}
}

export { worker };
