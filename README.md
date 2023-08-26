---

# Cloudflare Workers Echo

## Overview

This project is a Cloudflare Workers-based echo service that returns information about the incoming HTTP request. It can be useful for debugging and inspecting the various details related to the HTTP request, including headers, query parameters, and Cloudflare-specific information like the autonomous system number (ASN), country, etc.

## Features

- Returns incoming HTTP request details.
- Supports JSON and plain text bodies.

## TODO

- Add websocket support

## Installation

1. Clone the repository:

```bash
git clone https://github.com/nephelaiio/worker-echo.git
```

2. Navigate to the project directory:

```bash
cd worker-echo
```

3. Install dependencies:

```bash
npm install
```

## Deployment

1. Deploy using `wrangler`:

```bash
export CLOUDFLARE_API_TOKEN: XXXXXX
export FQDN=echo.nephelai.io
npx @nephelaiio/worker-deploy deploy --name echo --route "$FQDN/*"
```

## Usage

Send an HTTP request to the deployed Cloudflare Worker URL. The service will return a JSON object containing information about the request.

```bash
curl -X GET 'https://$FQDN?param1=value1&param2=value2'
```

## Response Structure

The returned JSON object will have the following structure:

```json
{
	"status": 200,
	"text": "OK",
	"content": "application/json",
	"url": "https://...",
	"origin": "https://...",
	"hostname": "...",
	"protocol": "https:",
	"port": "",
	"path": "/",
	"search": "?param1=value1&param2=value2",
	"method": "GET",
	"redirect": "manual",
	"headers": {
		// headers
	},
	"params": {
		"param1": "value1",
		"param2": "value2"
	},
	"body": null,
	"cloudflare": {
		// Cloudflare specific information
	}
}
```

## Contributing

If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## License

MIT
