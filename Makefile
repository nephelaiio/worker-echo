ifneq (,$(wildcard ./.env))
    include .env
    export
endif

WORKERD_BIN=${BUILD_DIR}/workerd
WORKERD_RELEASE=latest
WORKERD_OUTPUT=${BUILD_DIR}/worker

.PHONY: build dev lint format workerd

lint:
	npx -y prettier --check . &&
	npx -y eslint . --ext .ts,.tsx

format:
	npx -y prettier --write .

dev: wrangler.toml
	npx -y wrangler dev

serve: esbuild ${WORKERD_BIN} config.capnp
	${WORKERD_BIN} serve config.capnp

build: esbuild ${WORKERD_BIN} config.capnp
	${WORKERD_BIN} compile config.capnp > ${WORKERD_OUTPUT}

esbuild:
	npx esbuild \
			--bundle $${WORKER_ENTRY} --platform=browser --outfile=$${WORKER_OUTPUT} \
			--format=esm --conditions=worker,browser --sourcemap

${WORKERD_BIN}:
	curl -s https://api.github.com/repos/cloudflare/workerd/releases/${WORKERD_RELEASE} | \
	jq '.assets[] | select(.name | contains("linux-64")) | .browser_download_url' -r | \
	xargs curl -o ${WORKERD_BIN}.gz -sL && \
	gzip -fd ${WORKERD_BIN}.gz && \
	chmod +x ${WORKERD_BIN}

wrangler.toml: env.wrangler.toml
	envsubst < $< > $@

config.capnp: env.config.capnp
	envsubst < $< > $@
