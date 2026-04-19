import { Client, Databases, Account } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '');

export const databases = new Databases(client);
export const account = new Account(client);

/* ── Constants ── */
export const APPWRITE_DATABASE_ID = 'delta_db';
export const APPWRITE_COLLECTION_SLIDES = 'slides';
export const APPWRITE_COLLECTION_PRESENTATIONS = 'presentations';
