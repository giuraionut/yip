import log from 'loglevel';

const isServer = typeof window === 'undefined';

// Set the default log level
if (process.env.NODE_ENV === 'development') {
  log.setLevel('debug');
} else {
  log.setLevel('warn');
}

// Export different loggers for server and client if needed
export default log;
