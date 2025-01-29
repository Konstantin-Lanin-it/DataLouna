import { Client } from 'pg';

const client = new Client({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

client.connect();

export default client;