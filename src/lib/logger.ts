// Centralized logging utility
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, send to error tracking service
    if (!this.isDevelopment && level === 'error') {
      // TODO: Send to Sentry or similar service
      // Sentry.captureException(new Error(message), { extra: context });
    }

    // Console output
    const consoleMethod = level === 'error' ? console.error : 
                         level === 'warn' ? console.warn : 
                         console.log;
    
    consoleMethod(`[${level.toUpperCase()}]`, message, context || '');
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
