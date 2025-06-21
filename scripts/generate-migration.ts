import { execSync } from 'child_process';
import * as path from 'path';

// Join all arguments passed after the script name to form the migration name.
const userInput = process.argv.slice(2).join(' ');

if (!userInput) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '❌ Please provide a name for the migration.',
  );
  console.log('✅ Usage: yarn migration:generate -- Your Migration Name');
  process.exit(1);
}

/**
 * Converts a string to PascalCase.
 * Handles camelCase, kebab-case, snake_case, and space-separated words.
 * @param str The input string.
 * @returns The PascalCased string.
 */
const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/[\s-_]+/g, '');
};

const pascalCaseName = toPascalCase(userInput);

const migrationPath = path
  .join('src', 'migrations', pascalCaseName)
  .replace(/\\/g, '/');

// This command leverages the new `typeorm` script in `package.json`,
// which correctly registers `tsconfig-paths` to resolve path aliases.
const command = `yarn typeorm migration:generate ${migrationPath} -d ./ormconfig.ts`;

try {
  console.log(` MIGRATION │ Converting name to PascalCase: ${pascalCaseName}`);
  console.log(` MIGRATION │ Generating migration at: ${migrationPath}`);
  console.log(` MIGRATION │ Executing: ${command}`);
  execSync(command, { stdio: 'inherit' });

  console.log(
    '\x1b[32m%s\x1b[0m',
    ' MIGRATION │ Migration file generated successfully.',
  );
} catch (error) {
  // The `execSync` with `stdio: 'inherit'` will already print the error from the child process.
  console.error(
    '\x1b[31m%s\x1b[0m',
    ' MIGRATION │ ❌ Migration generation failed.',
  );
  console.error(error);
  process.exit(1);
}
