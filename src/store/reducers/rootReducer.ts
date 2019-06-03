import { localeReducer as locale } from 'react-localize-redux'
import {
  combineReducers
} from 'redux-immutable'

// - Import reducers
import { globalReducer } from './global'
import { serverReducer } from './server'

import { connectRouter } from 'connected-react-router/immutable'

// - Reducers
export const rootReducer = (history: any) => combineReducers({
    locale,
    server: serverReducer,
    router: connectRouter(history),
    global: globalReducer
  } as any)
