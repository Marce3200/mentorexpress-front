/**
 * Centralized environment configuration
 * Validates and provides access to environment variables
 */

const getBackendUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
  
  if (!url) {
    console.warn(
      "⚠️  BACKEND_URL not configured. Using default: http://localhost:3000"
    );
    return "http://localhost:3000";
  }

  // Validate URL format
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(
      `Invalid BACKEND_URL: "${url}". Must be a valid URL (e.g., http://localhost:3000)`
    );
  }
};

export const config = {
  backendUrl: getBackendUrl(),
} as const;

export default config;
