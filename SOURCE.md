# SignalForge Hub Source

SignalForge is the public community surface for operators. The public hub source lives at <https://github.com/CptPlastic/signalforge-node> and is the buildable hub stack people clone, inspect, and run.

## What Belongs in the Mirror

- Go server and database migrations.
- React web console.
- Recorder clients and build scripts.
- Dockerfiles, compose files, and the environment helper for local, production-style, Portainer, and peer-stack deployments.
- Operator documentation, update manifest behavior, and SignalHub federation docs.
- Example environment files with safe placeholders.

## What Does Not Belong

- Real `.env` files.
- API keys, magic-link provider secrets, webhook URLs, database passwords, or source upload keys.
- Local volumes, generated build output, operator-only deployment notes, or machine-specific config.
- Anything that would make one operator's hub look official by default.

## Include the Clients

Yes. The public mirror should include the clients. Operators need the whole hub, not just the API:

- `client/` is the web console people use to run a hub.
- `tools/p7-recorder-go/` and recorder UI tools are how local audio becomes a source.
- Docker and compose files tie the server and client together in a way non-developers can deploy.

The mirror can still ship prebuilt containers and release assets for people who do not want to build from source.

## Fastest Operator Path

Use the public hub source, official public images, Docker Desktop, and the Compose environment helper:

```bash
git clone https://github.com/CptPlastic/signalforge-node.git
cd signalforge-node
SIGNALFORGE_PUBLIC_URL=http://localhost:3000 make init-env
make install-up
curl http://localhost:8080/api/v1/health
```

The helper writes `.env.production`, generates a strong PostgreSQL password, and asks for the hub URL, name, ports, and optional Mailjet settings. The production Compose stack runs the web console, Go API, and PostgreSQL as separate services with one command. For a laptop test, install Docker Desktop, keep it running, use `http://localhost:3000` as the public hub URL, and open that URL after the stack starts.

The latest public tag is published at:

```text
https://signalforge.org/p7-scanner-update.json
```

Running hubs can check `/api/v1/update-check` to know when a newer public image is available.

## Local Build From Source

Server:

```bash
cd server
go test ./...
go build ./...
```

Web console:

```bash
cd client
npm install
npm run build
```

Local full stack:

```bash
docker compose up --build -d
```

Peer stack for SignalHub testing:

```bash
cp .env.peer.example .env.peer
docker compose --env-file .env.peer -f docker-compose.peer.yml up -d
```

## Trust Model

The source and containers should be open. Official status should not be automatic.

- Anyone can run a hub.
- Direct peering uses invite tokens.
- SignalForge can list known hubs.
- Verified and official status require maintainer approval.
- Remote sources should stay labeled with their origin hub.
