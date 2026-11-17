export async function readError(response, fallback = "Something went wrong") {
  try {
    const data = await response.json();
    return data.message || data.error || fallback;
  } catch {
    return fallback;
  }
}

export function friendlyError(err) {
  return err.message === "Failed to fetch" ? "Can't connect to server" : err.message;
}