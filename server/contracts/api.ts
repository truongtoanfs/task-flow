export const apiErrorCodes = [
  'BAD_REQUEST',
  'VALIDATION_ERROR',
  'AUTHENTICATION_REQUIRED',
  'FORBIDDEN',
  'RESOURCE_NOT_FOUND',
  'MEMBERSHIP_ALREADY_EXISTS',
  'ASSIGNEE_NOT_PROJECT_MEMBER',
  'ASSIGNMENT_ALREADY_EXISTS',
  'LAST_OWNER_REQUIRED',
  'MEMBER_HAS_ASSIGNMENTS',
  'VERSION_CONFLICT',
  'INTERNAL_ERROR',
] as const

export type ApiErrorCode = (typeof apiErrorCodes)[number]

export type ApiErrorStatus =
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 500

export interface ValidationIssue {
  path: string
  code: string
  message: string
}

export interface ApiSuccessResponse<T> {
  data: T
}

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode
    message: string
    details?: unknown
  }
}