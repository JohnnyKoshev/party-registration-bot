# Party Registration Bot

Simple Telegram Bot built on GrammyJS to register for Zolushka's party.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- A Telegram Bot Token (You can get one from [BotFather](https://t.me/botfather))

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/JohnnyKoshev/party-registration-bot
cd party-registration-bot
```

Install all the required npm dependencies:

```bash
npm install
```

Create a `.env` file in the root directory of your project and add your Telegram bot token:

```plaintext
BOT_TOKEN=your_bot_token_here
```

Ensure your database is set up correctly. This project uses the following table structure:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    telegram_id BIGINT,
    name VARCHAR(255),
    surname VARCHAR(255),
    selfie_size FLOAT
);
```

Adjust the database configuration in your project as needed to match your setup.

## Running the Bot

To start the bot in development mode with hot reload (using nodemon), run:

```bash
npm run start:dev
```

To start the bot in normal mode, run:

```bash
npm start
```

## Usage

Once the bot is running, you can interact with it via Telegram.
