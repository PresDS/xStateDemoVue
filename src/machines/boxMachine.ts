import { createMachine } from 'xstate'

export const boxMachine = createMachine({
  id: 'box',
  initial: 'hidden',
  states: {
    hidden: {
      on: { TOGGLE: 'visible' }
    },
    visible: {
      on: { TOGGLE: 'hidden' }
    }
  }
})
