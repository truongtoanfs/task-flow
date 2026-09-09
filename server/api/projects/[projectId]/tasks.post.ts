import { setResponseStatus } from 'h3'
import { createTask } from '../../../services/task-service'
import { defineApiHandler } from '../../../utils/api-handler'
import { requireActorId } from '../../../utils/current-actor'
import {
  parseRequestBody,
  parseRequestParams,
} from '../../../utils/request-validation'
import {
  createTaskBodySchema,
  projectParamsSchema,
} from '../../../validation/task'

export default defineApiHandler(async (event) => {
  const actorId = requireActorId(event)

  const { projectId }
    = parseRequestParams(
      event,
      projectParamsSchema,
    )

  const body = await parseRequestBody(
    event,
    createTaskBodySchema,
  )

  const task = await createTask({
    projectId,
    actorId,
    body,
  })

  setResponseStatus(event, 201)

  return task
})