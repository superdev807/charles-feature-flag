import { lightBlue } from '@material-ui/core/colors'
import { createMuiTheme, MuiThemeProvider, responsiveFontSizes } from '@material-ui/core/styles'
import * as React from 'react'
import { render } from 'react-dom'
import { domEnv } from './common/domEnv'
import { httpEnv } from './common/httpEnv'
import { timer } from './common/timer'
import {
  API_DOMAIN,
  AUTH_REFRESH_TIMING,
  AUTH_REFRESH_TOKEN_KEY,
  FEATURE_FLAG_EXPIRATION,
  ROOT_ELEMENT_SELECTOR,
} from './constants'
import { createAuthAdapter, AuthEnv } from './infrastructure/adapters/AuthAdapter'
import { createFeatureFlagRepository } from './infrastructure/repositories/FeatureFlagRepository'
import { App } from './ui/App'
import { ErrorBoundary } from './ui/components/ErrorBoundary'
import { AuthProvider } from './ui/context/AuthContext'
import { DomEnvProvider } from './ui/context/DomEnvContext'
import { ErrorProvider } from './ui/context/ErrorContext'
import { HttpEnvProvider } from './ui/context/HttpEnvContext'
import { TimerProvider } from './ui/context/TimerContext'

const { document } = domEnv
const rootElement = document.querySelector(ROOT_ELEMENT_SELECTOR)

if (!rootElement) {
  throw new Error(`Unable to find root element ${ROOT_ELEMENT_SELECTOR}`)
}

const authAdapter = createAuthAdapter(API_DOMAIN, AUTH_REFRESH_TOKEN_KEY)
const featureFlagRepository = createFeatureFlagRepository(API_DOMAIN)
const authEnv: AuthEnv = {
  ...httpEnv,
  ...domEnv,
  storage: localStorage,
}

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: {
        light: '#26E7E1',
        main: '#0CCDC7',
        dark: '#00B4AE',
      },
      secondary: lightBlue,
    },
  }),
)

render(
  <ErrorProvider>
    <TimerProvider value={timer}>
      <DomEnvProvider args={[domEnv]}>
        <HttpEnvProvider args={[httpEnv]}>
          <ErrorBoundary>
            <AuthProvider args={[authAdapter, authEnv, AUTH_REFRESH_TIMING]}>
              <MuiThemeProvider theme={theme}>
                <App
                  featureFlagRepository={featureFlagRepository}
                  featureFlagExpiration={FEATURE_FLAG_EXPIRATION}
                />
              </MuiThemeProvider>
            </AuthProvider>
          </ErrorBoundary>
        </HttpEnvProvider>
      </DomEnvProvider>
    </TimerProvider>
  </ErrorProvider>,
  rootElement,
)
