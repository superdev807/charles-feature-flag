import { createRoute } from '@typed/routing'

export const currentRoute = createRoute('/')
export const longTermRoute = createRoute('/long-term')
export const deletedRoute = createRoute('/deleted')
export const deployedRoute = createRoute('/deployed')
export const flagRoute = createRoute<{ readonly flagName: string }>('/flag/:flagName')
