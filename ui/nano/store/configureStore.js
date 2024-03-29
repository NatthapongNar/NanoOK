import { createStore, applyMiddleware } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../../common/reducers'

export default () => {
    const middlewares = [thunk, apiMiddleware]

    if (process.env.NODE_ENV !== 'production')
        middlewares.push(createLogger())

    const store = createStore(
        rootReducer,
        applyMiddleware(...middlewares)
    )

    if (module.hot) {
        module.hot.accept('../../common/reducers', () => {
            System.import('../../common/reducers').then(nextRootReducer =>
                store.replaceReducer(nextRootReducer.default)
            )
        })
    }

    return store
}