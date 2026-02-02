type LogMeta = Record<string, unknown>;

function formatLog(message: string, meta?: LogMeta) {
  if (!meta || Object.keys(meta).length === 0) return message;
  return `${message} ${JSON.stringify(meta)}`;
}

// Minimal, dependency-free logger that works in both Node and browser runtimes.
// Intentionally keeps a tiny surface area (info/warn/error) to match current usage.
const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(formatLog(message, meta));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(formatLog(message, meta));
  },
  error(message: string, meta?: LogMeta) {
    console.error(formatLog(message, meta));
  },
};

export default logger;
