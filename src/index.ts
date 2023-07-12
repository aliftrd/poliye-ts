import { logger } from './applications/logging'
import { web } from './applications/web'

const PORT: string | number = process.env.port ?? 3000

web.listen(PORT, () => {
  logger.info('Server is running at port 3000')
})
