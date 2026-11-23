<template>

    <button @click="handleFlip" class="flip-button">
        Flip Card
    </button>

    <div class="game-container">


        <div :class="['side-panel']">
            <div v-if="cardGameState.matches('cardFlipped')" class="card-flipped">
                <button @click="send({ type: 'UPDATE_TOTAL' })" class="update-total-button">
                    Update Total
                </button>
            </div>

            <div v-if="cardGameState.matches('updatingTotal')" class="side-panel updating">
                <p>Updating Total...</p>
            </div>

            <div v-if="cardGameState.matches('waitingForNextTurn')" class="waiting">
                <p>Waiting for next turn...</p>
                <button @click="send({ type: 'START_NEW_TURN' })">Start New Turn</button>
            </div>

            <ul>
                <li v-for="user in users">
                    <p>{{ user.name }}</p>
                    <p>{{ user.total }}</p>
                </li>
            </ul>
        </div>

        <div class="card-container">
            <Card v-for="card in cards" :id="card.id" :amount="card.amount" :userId="card.userId"
                :active="isCardActive(card)" :cardGameState="cardGameState" />
        </div>
    </div>

</template>

<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { cardGameMachine } from '../machines/cardGameMachine.ts'
import { ref, watch } from 'vue'
import Card from './Card.vue'
import { sampleCards } from '../data/sampleCards.ts'
import { sampleUsers } from '../data/sampleUsers.ts'

interface Card {
    id: string
    userId: string
    amount: number
}

const { snapshot: cardGameState, send } = useMachine(cardGameMachine)
const total = ref<number>(0)
const activeCardIndex = ref<number>(0);
const activeCard = ref<Card>(sampleCards[0])
const cards = ref(sampleCards)
const users = ref(sampleUsers)

console.log('INITIAL STATE', cardGameState)

watch(cardGameState, (newValue, oldValue) => {
    console.log(
        `%cstate changed from: %c${oldValue.value} %cto: %c${newValue.value}`,
        'color: gray',
        'color: red; font-weight: bold',
        'color: gray',
        'color: green; font-weight: bold'
    )

    if (cardGameState.value.matches('updatingTotal')) {
        updateTotal()
    }

    if (cardGameState.value.matches('flippingCard')) {
        // Play audio
        setTimeout(() => {
            send({ type: 'CARD_FLIPPED' })
        }, 1000)
    }
})

const isCardActive = (card: Card) => {
    return sampleCards[activeCardIndex.value]?.id === card.id
}

const handleFlip = () => {
    send({ type: 'FLIP_CARD' })

}

const setNextCard = () => {
    if (activeCardIndex.value <= sampleCards.length) {
        activeCardIndex.value += 1;
        activeCard.value = sampleCards[activeCardIndex.value]
    }
}

const updateTotal = (): void => {
    console.log('updateTotal')
    const userToUpdate = users.value.find(u => u.id === activeCard.value.userId)!
    const newAmount = userToUpdate.total + activeCard.value.amount
    const interval = setInterval(() => {
        if (userToUpdate.total < newAmount) {
            userToUpdate.total += 1
        } else {
            clearInterval(interval)
            send({ type: 'TOTAL_UPDATED' })

            setNextCard()
        }
    }, 200)

    setTimeout(() => {
        send({ type: 'TOTAL_UPDATED' })
    }, 4000)
}

</script>

<style scoped>
.game-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px;
    width: 100%;
}

.flip-button {
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    cursor: pointer;
}

.card-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.update-total-button {
    padding: 10px 20px;
    background-color: #e67e22;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}

.side-panel {
    /* position: absolute; */
    margin-top: 30px;
    padding: 20px;
    background-color: #28252b;
    color: black;
    font-size: 24px;
    font-weight: bold;
}

.side-panel ul {
    list-style-type: none;
}

.side-panel ul li {
    color: white;
    background-color: #8e44ad;
    border-radius: 12px;
}

.waiting {
    margin-top: 20px;
    font-size: 20px;
    color: yellow;
}

.waiting button {
    padding: 10px 20px;
    background-color: #4486ad;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}
</style>