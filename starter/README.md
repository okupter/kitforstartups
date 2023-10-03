# 🚀 KitForStartups

The Open Source SvelteKit SaaS boilerplate.

_KitForStartups_ is a starter kit for building and shipping fast, secure, and scalable full stack SaaS applications with SvelteKit and TypeScript.

The starter is built and maintained by [Okupter](https://www.okupter.com).

If you already found yourself in a situation where you were:

- Trying to set up various authentication systems (email/password, social logins, OAuth, etc.)
- Scratching your head over how to structure your app
- Spending too much time setting up payments for your SvelteKit app either with Stripe or Lemon Squeezy
- Fighting against your email provider for sending emails from your app, and testing them reliably on your local machine
- Doing all the above again and again for every new project

Then _KitForStartups_ is for you 🎉!

## ⚒️ Tech Stack

- SvelteKit
- TypeScript
- Zod
- Drizzle ORM
- Drizzle Kit
- Tailwind CSS
- MySQL
- SQLite
- PostgreSQL
- Stripe (coming soon)
- Lemon Squeezy (coming soon)
- Resend
- Mailgun (coming soon)

## 📦 Getting Started

The default configuration for the project uses MySQL as a database.

### Prerequisites

- Node.js 18+
- MySQL 8.1+
- pnpm
- Docker Compose (optional)

### Installation

1. Setup

- Clone or fork the repository:

```bash
git clone https://github.com/okupter/kitforstartups my-project
```

2. Install dependencies

```bash
cd my-project
pnpm install
```

3. Setup the environment variables

Duplicate the `.env.example` file and rename it to `.env`. Then, fill in the values for the environment variables.

```bash
cp .env.example .env
```

4. Setup the database

For easy local development, there is a `./docker/mysql.yml` file that you can use to spin up a MySQL database in a Docker container. If you don't want to use Docker, you can install MySQL locally and skip this step.

```bash
docker-compose -f docker/mysql.yml up -d
```

Remember to update the MYSQL\_\* environment variables in the `.env` file with your database credentials.

5. Run the migrations

We use [`Drizzle Kit`](https://orm.drizzle.team/kit-docs/overview) for automatic SQL migrations and prototyping.

To run the migrations for MySQL, run the following command:

```bash
pnpm generate-migrations:mysql
```

This will generate the SQL migrations, as well as migrations metadata files in the `./src/lib/drizzle/mysql/migrations/data` directory.

You can now run the following command to push the migrations to the database:

```bash
pnpm migrate:mysql
```

In early stage of development or when you're at the prototyping stage, you can use directly update the database schema and run the following command to directly push the schema changes to the database:

```bash
pnpm push:mysql
```

6. Setup MailHog for local email testing

We use MailHog to send and test emails locally. The boilerplate is configured to automatically send emails to MailHog when running in development mode.

Check `./src/lib/emails/send.ts` for more details about the implementation.

We also provide a Docker Compose file to quickly spin up a MailHog container.

```bash
docker-compose -f docker/mailhog.yml up -d
```

The MailHog server will be available at `http://localhost:8025`.

7. Run the app

```bash
pnpm dev
```

### Changing the database

Right now, there is no CLI or configuration file to change the database. You will have to do some search and replace in the codebase to change the database.

The default database is MySQL. If you want to use PostgreSQL, you will have to:

* Change occurences of `$lib/lucia/mysql` to `$lib/lucia/postgres` in the `./src` directory
* Change occurences of `$lib/drizzle/mysql/models` to `$lib/drizzle/postgres/models` in the `./src` directory

This should be enough to get you started with PostgreSQL.

**PS**: This won't be necessary in the future, as we plan to add a central configuration file for the app and a CLI to generate a starter project with the database of your choice.

## 🗺️ Roadmap

KitForStartups is still in the early stages of development. Here is a list of features that we plan to add in the very near future:

- [x] PostgreSQL support
- [x] Proper error handling on the client with toast notifications
- [ ] A central configuration file for the app
- [ ] Magic link authentication
- [x] Authorization logic with load functions and hooks
- [ ] Stripe integration
- [ ] Lemon Squeezy integration
- [ ] Mailgun integration
- [ ] CLI for generating a starter project
