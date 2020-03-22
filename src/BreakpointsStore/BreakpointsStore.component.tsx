import React, { Fragment, FunctionComponent } from 'react'
import set from 'lodash/set'
import get from 'lodash/get'

import { Context } from '../Context'

export class BreakpointsStore {
  public buildBreakpointComponents(normalizedMediaQueryDict: NormalizedMediaQueryDict) {
    Object.keys(normalizedMediaQueryDict).forEach(key => {
      const Breakpoint: FunctionComponent = ({ children }) => {
        return (
          <Context.Consumer>
            {breakpoints => (breakpoints && get(breakpoints, key) ? children : <Fragment />)}
          </Context.Consumer>
        )
      }

      Breakpoint.displayName = `Breakpoint.${key}`

      set(this, key, Breakpoint)
    })
  }
}

export const breakpointsStoreInstance = new BreakpointsStore()
export const proxiedBreakpointsStoreInstance = new Proxy(breakpointsStoreInstance, {
  get: (target, propKey) => {
    const isMissingComponent = !(propKey in target) && propKey !== '__esModule' && process.env.NODE_ENV !== 'production'

    if (isMissingComponent) {
      console.warn(
        `[RMB] You are trying to use component(${String(propKey)}). 
          That name doesn't match any breakpoint you have provided.
          Current breakpoints components names are: ${Object.keys(target).join(', ')}`,
      )
    }

    return !isMissingComponent ? target[propKey] : () => null
  },
})