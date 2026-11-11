import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const output = 'src/i18n/message-ids.ts';
const cli = fileURLToPath(new URL('./cli.js', import.meta.resolve('@lemuel-manske/i18n')));
const temporary = await mkdtemp(join(tmpdir(), 'openarchive-i18n-'));

try {
  const generated = join(temporary, 'message-ids.ts');

  await run(process.execPath, [cli, 'locales/en.json', generated, 'locales/pt-BR.json']);

  const content = (await readFile(generated, 'utf8')).replace(
    /^(export const .+;)\n\n(?=export const )/gm,
    '$1\n',
  );

  if (process.argv.includes('--check')) {
    const existing = await readFile(output, 'utf8').catch((error) => {
      if (error.code !== 'ENOENT') throw error;

      return null;
    });

    if (existing !== content) {
      throw new Error(`${output} is missing or out of date. Run npm run i18n:generate.`);
    }
  } else {
    await writeFile(output, content);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
