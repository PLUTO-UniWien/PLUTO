import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Runs a shell command and returns the output as a string.
 * @param cmd Command to run and return output from.
 * @returns Output of the command.
 */
export function sh(cmd: string) {
  return execSync(cmd).toString().trim();
}

/**
 * Reads the environment variables from the supplied `envFilePath` and updates
 * the values of the variables with the supplied `values`.
 *
 * - Existing values not included in the `values` object will be left unchanged.
 * - New values in the `values` object will be added to the file.
 *
 * The env file is expected to have the format:
 * ```
 * KEY1=VALUE1
 * KEY2=VALUE2
 * ```
 *
 * @param envFilePath Path to the env file to update.
 * @param values Object containing the values to update.
 */
export function updateEnvFile(
  envFilePath: string,
  values: Record<string, string>
) {
  // Check if file exists
  let envFileContent = '';
  try {
    envFileContent = readFileSync(envFilePath, { encoding: 'utf8' });
  } catch (err) {
    console.error(`Failed to read the env file at ${envFilePath}`);
    return;
  }

  // Parse existing environment variables
  const envVars = envFileContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);

  // Update with new values
  for (const [key, value] of Object.entries(values)) {
    envVars[key] = value;
  }

  // Write back to file
  const updatedEnvFileContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  try {
    writeFileSync(envFilePath, updatedEnvFileContent, { encoding: 'utf8' });
  } catch (err) {
    console.error(`Failed to write the updated env file at ${envFilePath}`);
  }
}
