declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      MONGODB_URI: string
      BASIC_AUTH_CREDENTIALS: string
    }
  }
}

// convert this file into a module by adding an empty export statement
// in order to gain IntelliSense for ``ProcessEnv`` typings
export {}
