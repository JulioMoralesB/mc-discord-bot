# Discord Firewall Bot

This is a Node.js Discord bot designed to interact with users via natural language and manage IP access to a firewall, particularly for a Minecraft server. It communicates with an NLP (Natural Language Processing) microservice and a firewall management API.

## Features

- Accepts user messages via Discord and interprets intents with an NLP microservice.
- Adds IP addresses to a firewall to allow access to a Minecraft server.
- Validates IP addresses before submitting them to the firewall API.
- Supports basic small talk through the NLP API.
- Handles both direct messages and mentions in servers.

## Environment Variables

The bot relies on the following environment variables (usually set in a `.env` file):

| Variable                     | Description                                               |
|-----------------------------|-----------------------------------------------------------|
| `DISCORD_TOKEN`             | Your Discord bot token.                                   |
| `NLP_API_URL`               | URL of the NLP service (default: `http://localhost:8000`).|
| `FIREWALL_API_URL`          | URL of the firewall management API. (default: `http://localhost:8000`).|
| `FIREWALL_SECURITY_LIST_OCID` | OCID of the security list where the IP will be added.    |
| `MINECRAFT_SERVER_PORT`     | TCP port for the Minecraft server (default: `25565`).     |
| `MINECRAFT_VOICE_CHAT_PORT` | UDP port for voice chat (default: `25560`).               |

## Setup

1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/discord-firewall-bot.git
    cd discord-firewall-bot
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file with your configuration:
    ```env
    DISCORD_TOKEN=your_token_here
    NLP_API_URL=http://localhost:8000
    FIREWALL_API_URL=http://localhost:8001
    FIREWALL_SECURITY_LIST_OCID=ocid1.securitylist.oc1..example
    MINECRAFT_SERVER_PORT=25565
    MINECRAFT_VOICE_CHAT_PORT=25560
    ```

4. Start the bot:
    ```bash
    node index.js
    ```

## Docker Support

You can run the bot using Docker:

### Dockerfile

```
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD pgrep node || exit 1
```

### Build and run

```bash
docker build -t discord-firewall-bot .
docker run --env-file .env discord-firewall-bot
```

## License

MIT