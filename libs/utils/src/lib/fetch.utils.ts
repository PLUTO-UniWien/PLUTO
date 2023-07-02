export function constructFetchUrl(
  baseUrl: string,
  params: Record<string, string>
): string {
  const queryString = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join('&');
  return `${baseUrl}?${queryString}`;
}

export async function extractError(response: Response): Promise<object | null> {
  if (!response.ok) {
    try {
      // Attempt to read response as JSON
      return await response.json();
    } catch (error) {
      // Ignore errors during error message extraction
    }

    // If no specific error message can be extracted, return the status text
    return { error: response.statusText };
  }

  // If response is OK, return null
  return null;
}
