import { execSync } from 'child_process';

/**
 * Runs a shell command and returns the output as a string.
 * @param cmd Command to run and return output from.
 * @returns Output of the command.
 */
export function sh(cmd: string) {
  return execSync(cmd).toString().trim();
}
