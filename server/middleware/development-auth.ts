import { defineEventHandler } from 'h3'
import { z } from 'zod'

export default defineEventHandler((event) => {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const config = useRuntimeConfig(event)

  const result = z.uuid().safeParse(
    config.taskflowDevActorId,
  )

  if (result.success) {
    event.context.auth = {
      userId: result.data,
    }
  }
})