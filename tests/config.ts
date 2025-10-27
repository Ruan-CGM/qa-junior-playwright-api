import { existsSync, readFileSync } from 'fs';
import * as path from 'path';

export function getToken(): string {
  const envToken = process.env.TOKEN?.trim();
  if (envToken) return envToken;

  const tokenFile = path.join(process.cwd(), 'tests', '.token');
  if (existsSync(tokenFile)) {
    const fileToken = readFileSync(tokenFile, 'utf8').trim();
    if (fileToken) return fileToken;
  }

  throw new Error(
    'TOKEN não definido. Defina a variável de ambiente TOKEN ou crie tests/.token (gitignored) com o token.'
  );
}

