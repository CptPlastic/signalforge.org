# SignalForge Source Mirror

SignalForge is the public community surface for P7 Scanner operators. The public source mirror should be a clean, buildable downstream copy of the P7 Scanner stack.

## What Belongs in the Mirror

- Go server and database migrations.
- React web console.
- Recorder clients and build scripts.
- Dockerfiles and compose files for local, Plesk, Portainer, and peer-stack deployments.
- Operator documentation, update manifest behavior, and SignalHub federation docs.
- Example environment files with safe placeholders.

## What Does Not Belong

- Real `.env` files.
- API keys, magic-link provider secrets, webhook URLs, database passwords, or source upload keys.
- Local volumes, generated build output, private deployment notes, or machine-specific config.
- Anything that would make one operator's node look official by default.

## Include the Clients

Yes. The public mirror should include the clients. Operators need the whole node, not just the API:

- `client/` is the web console people use to run a hub.
- `tools/p7-recorder-go/` and recorder UI tools are how local audio becomes a source.
- Docker and compose files tie the server and client together in a way non-developers can deploy.

The mirror can still ship prebuilt containers and release assets for people who do not want to build from source.

## Fastest Operator Path

Use official public images:

```bash
IMAGE_NAMESPACE=cptplastic
IMAGE_TAG=<published-short-sha>
docker-compose --env-file .env -f docker-compose.plesk.yml up -d
```

The latest public tag is published at:

```text
https://signalforge.org/p7-scanner-update.json
```

Running hubs can check `/api/v1/update-check` to know when a newer public image is available.

## Build From Source

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
docker-compose up --build -d
```

Peer stack for SignalHub testing:

```bash
cp .env.peer.example .env.peer
docker-compose --env-file .env.peer -f docker-compose.peer.yml up -d
```

## Trust Model

The source and containers should be open. Official status should not be automatic.

- Anyone can run a node.
- Direct peering uses invite tokens.
- SignalForge can list known hubs.
- Verified and official status require maintainer approval.
- Remote sources should stay labeled with their origin hub.
