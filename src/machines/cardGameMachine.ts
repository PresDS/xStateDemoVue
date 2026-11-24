import { assign, setup } from 'xstate'
import { sampleCards } from '../data/sampleCards'
import { sampleUsers } from '../data/sampleUsers'

export interface CardData {
  id: string
  userId: string
  amount: number
}

export interface UserData {
  id: string
  name: string
  total: number
}

interface GameContext {
  cards: CardData[]
  users: UserData[]
  activeCardIndex: number
}

const createContext = (): GameContext => ({
  cards: structuredClone(sampleCards),
  users: structuredClone(sampleUsers),
  activeCardIndex: 0,
})

export const cardGameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as
      | { type: 'FLIP_CARD' }
      | { type: 'UPDATE_TOTAL' }
      | { type: 'START_NEW_TURN' }
      | { type: 'RESTART' },
  },
  guards: {
    isLastCard: ({ context }) => context.activeCardIndex >= context.cards.length - 1,
  },
  actions: {
    addAmountToUser: assign({
      users: ({ context }) => {
        const card = context.cards[context.activeCardIndex]
        return context.users.map((u) =>
          u.id === card.userId ? { ...u, total: u.total + card.amount } : u
        )
      },
    }),
    advanceCard: assign({ activeCardIndex: ({ context }) => context.activeCardIndex + 1 }),
    resetGame: assign(() => createContext()),
  },
}).createMachine({
  id: 'cardGame',
  initial: 'idle',
  context: createContext,
  states: {
    idle: {
      on: { FLIP_CARD: 'flippingCard' },
    },
    flippingCard: {
      after: { 1000: 'cardFlipped' },
    },
    cardFlipped: {
      on: { UPDATE_TOTAL: 'updatingTotal' },
    },
    updatingTotal: {
      // Total changes immediately in context; the UI animates the count-up.
      entry: 'addAmountToUser',
      after: {
        2000: [{ guard: 'isLastCard', target: 'gameOver' }, { target: 'waitingForNextTurn' }],
      },
    },
    waitingForNextTurn: {
      on: { START_NEW_TURN: { target: 'idle', actions: 'advanceCard' } },
    },
    gameOver: {
      on: { RESTART: { target: 'idle', actions: 'resetGame' } },
    },
  },
})
