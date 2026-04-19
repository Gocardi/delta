import { Client, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '');

export const databases = new Databases(client);

/* ── Constants ── */
export const APPWRITE_DATABASE_ID = 'delta_db';
export const APPWRITE_COLLECTION_SLIDES = 'slides';
export const APPWRITE_COLLECTION_PRESENTATIONS = 'presentations';
