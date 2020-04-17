import { createContext, useContext } from 'react'
import { timer } from '../../common/timer'

export const TimerContext = createContext(timer)
export const { Provider: TimerProvider } = createContext(timer)
export const useTimer = () => useContext(TimerContext)
