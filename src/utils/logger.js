const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logger utility
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, "app.log");
    this.errorFile = path.join(logsDir, "error.log");
  }

  // Format Log message
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr =
      Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  }

  // Write to file
  writeToFile(filename, message) {
    try {
      fs.appendFileSync(filename, message);
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }

  // Log info messages
  info(message, meta = {}) {
    const logMessage = this.formatMessage("info", message, meta);

    if (process.env.NODE_ENV !== "test") {
      console.log(`ℹ️  ${message}`);
    }

    this.writeToFile(this.logFile, logMessage);
  }

  // Log error messages
  error(message, error = null, meta = {}) {
    const errorMeta = error
      ? {
          ...meta,
          stack: error.stack,
          name: error.name,
        }
      : meta;

    const logMessage = this.formatMessage("error", message, errorMeta);

    if (process.env.NODE_ENV !== "test") {
      console.error(`❌ ${message}`);
      if (error && error.stack) {
        console.error(error.stack);
      }
    }

    this.writeToFile(this.errorFile, logMessage);
  }

  // Log warning messages
  warn(message, meta = {}) {
    const logMessage = this.formatMessage("warn", message, meta);

    if (process.env.NODE_ENV !== "test") {
      console.warn(`⚠️  ${message}`);
    }

    this.writeToFile(this.logFile, logMessage);
  }

  // Log debug messages (only in development)
  debug(message, meta = {}) {
    if (process.env.NODE_ENV === "development") {
      const logMessage = this.formatMessage("debug", message, meta);
      console.log(`🔍 ${message}`);
      this.writeToFile(this.logFile, logMessage);
    }
  }

  // Log HTTP requests
  request(req, res) {
    const message = `${req.method} ${req.originalUrl}`;
    const meta = {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      statusCode: res.statusCode,
      contentLength: res.get("Content-Length") || 0,
    };

    if (res.statusCode >= 400) {
      this.error(message, null, meta);
    } else {
      this.info(message, meta);
    }
  }

  // Log authentication events
  auth(message, userId = null, meta = {}) {
    const authMeta = userId ? { ...meta, userId } : meta;
    this.info(`AUTH: ${message}`, authMeta);
  }

  // Clear old logs (older than 30 days)
  clearOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    [this.logFile, this.errorFile].forEach((file) => {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        if (stats.mtime < thirtyDaysAgo) {
          try {
            fs.unlinkSync(file);
            console.log(`Cleared old log file: ${file}`);
          } catch (error) {
            console.error(`Failed to clear old log file ${file}:`, error);
          }
        }
      }
    });
  }
}

// Create singleton instance
const logger = new Logger();

// Clear old logs on startup
logger.clearOldLogs();

module.exports = logger;
