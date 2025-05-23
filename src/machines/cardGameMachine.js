import { createMachine } from 'xstate'

export const cardGameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMCGAnCBxVBbMAdAJYQA2YAxAGIAyAkgAoD6AwgIIBKAIgNoAMAXUSgADgHtYRAC5ExAO2EgAHogCMAZlUE+OvqoBM+gGzq+AFgCcZgBwAaEAE9EhgKwF9LnepfX96iz5mAL5B9miYOPgEAGakRCIiRHJQLBgQFOzcTLSMDACivIKK4pIy8ooqCJbWBBb6qhaqLgDsLi5GBs32Tgiu7p583r7+gSFhaZGE4RBUcQmQFACqDFxsACp5TGsA8mtsNPxCSCAl0rIKx5XWqlpGfFb31lZG9Ubdzh79Xj5+AdbBoRA00mBAAriIIKgZMk1mIpKhSBQdnsaExlqsNoUjqIJGdypc1H4jAQzPULJojM0NNZ1O9ep8PN9hn8AeMInhCAB3VBnZJUMToAByYCUUjWoPQcgoAGU9hw1kxBXkAOpbRYcQWHYq4soXUCVAzqYmkhoUqnqGl064kiy2qzWB3NdRmNohQFyMQQOCKYEc7Wlc4VRAAWjejhDxN0gw0zWaNlU93UYyBEw5xDIYH9eL1ykQpKtzQIPnUztMeg6ASTgN9UVi8USyVSmCzuqDvTjRfJzWsfBcHnqDrpDX0JLMCeMFieenuyZrUzSs3rkBbgYJCEpI-aHhLzo6qiMFjpfVaOjjen0TsMVbZ2DT4Mh0KgsPhpBX+P1iEnFnc0eaRhc5I3M0h7hr0fAjoyOgJhaHQtPos6plE3K8lA-JCiKYoSjmpytmuqhmBaBD-Ba+hjmRJZ0hYfDaDS3gtJo9R8NYbpBEAA */
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
}, {
  actions: {
    animateCardFlip: () => console.log('Card flip animation triggered'),
    animateTotalUpdate: () => console.log('Side panel total update animation triggered')
  }
})
