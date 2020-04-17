export const BUILD_ENV: string = process.env.BUILD_ENV || 'development'
export const isDevelopment: boolean = BUILD_ENV === 'development'
