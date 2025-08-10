type HeadersLike =
  | Headers
  | Record<string, string | string[]>
  | { [key: string]: unknown };

export const getClientIp = (req: { headers?: HeadersLike }): string => {
  if (!req.headers) return "127.0.0.1";

  let forwarded: string | undefined | null = null;

  if (req.headers instanceof Headers) {
    forwarded = req.headers.get("x-forwarded-for");
  } else if (
    req.headers &&
    typeof req.headers === "object" &&
    !("get" in req.headers) // exclude Headers-like objects
  ) {
    // TypeScript now knows this is a plain object
    const headersLower: Record<string, string> = {};
    for (const key in req.headers) {
      const value = req.headers[key];
      if (Array.isArray(value)) {
        headersLower[key.toLowerCase()] = value.join(", ");
      } else if (typeof value === "string") {
        headersLower[key.toLowerCase()] = value;
      }
    }
    forwarded = headersLower["x-forwarded-for"];
  }

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return "127.0.0.1";
};
