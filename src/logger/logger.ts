import * as wintson from 'winston';
import colors from '@colors/colors';
import dotenv from 'dotenv';

dotenv.config({ path: './env/.env.qa' });

//Define the custom format
const myFormat = wintson.format.printf(({ level, message, timestamp }) => {
  const msgStr = typeof message === 'string' ? message : JSON.stringify(message);

  timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    hour12: false,
  });

  let colorizedMessage = msgStr;

  switch (level) {
    case 'error':
      colorizedMessage = colors.red(msgStr);
      break;

    case 'warn':
      colorizedMessage = colors.yellow(msgStr);
      break;

    case 'info':
      colorizedMessage = colors.green(msgStr);
      break;
  }
  return `${timestamp} [${level.toUpperCase()}]: ${colorizedMessage}`;
});

//Create a logger instance
const logger = wintson.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: wintson.format.combine(wintson.format.timestamp(), myFormat),
  transports: [new wintson.transports.Console()],
});

export default logger;
