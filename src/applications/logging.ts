import 'dotenv/config'
import { createLogger, format, type Logger, transports, addColors } from 'winston'
import * as process from 'process'
import { type AbstractConfigSetColors } from 'winston/lib/winston/config'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const level = (): string => {
  const env: string = process.env.NODE_ENV ?? 'development'
  const isDevelopment: boolean = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const colors: AbstractConfigSetColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

addColors(colors)

const customFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf((info): string => {
    const { timestamp, level, message, ...args } = info
    const ts: string = timestamp.slice(0, 19).replace('T', ' ')
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${ts} [${level}]: ${message} ${Object.keys(args).length > 0 ? JSON.stringify(args, null, 2) : ''}`
  })
)

// const productionTransports = [
//   new transports.File({
//     filename: 'logs/error.log',
//     level: 'error'
//   }),
//   new transports.File({
//     filename: 'logs/all.log'
//   })
// ]

const customTransports = [
  new transports.Console()
  // ...(process.env.NODE_ENV === 'production' ? productionTransports : [])
]

export const logger: Logger = createLogger({
  level: level(),
  levels,
  format: customFormat,
  transports: customTransports
})
