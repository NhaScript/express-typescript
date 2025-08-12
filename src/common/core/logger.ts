import pino from 'pino';
const log = pino({
  base: { pid: false },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default log;
