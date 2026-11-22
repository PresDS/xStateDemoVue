import { setup } from 'xstate'

export const cardGameMachine = setup({
  actions: {
    animateCardFlip: () => console.log('Card flip animation triggered'),
    animateTotalUpdate: () => console.log('Side panel total update animation triggered')
  }
}).createMachine({
  id: 'cardGame',
  initial: 'idle',
  states: {
    idle: {
      on: { FLIP_CARD: 'flippingCard' }
    },
    flippingCard: {
      entry: ['animateCardFlip'],
      on: { CARD_FLIPPED: 'cardFlipped' }
    },
    cardFlipped: {
      on: { UPDATE_TOTAL: 'updatingTotal' }
    },
    updatingTotal: {
      entry: ['animateTotalUpdate'],
      on: { TOTAL_UPDATED: 'waitingForNextTurn' }
    },
    waitingForNextTurn: {
      on: { START_NEW_TURN: 'idle' }
    }
  }
})
