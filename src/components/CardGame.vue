<template>
    <div class="game-container">
        <button @click="send({ type: 'FLIP_CARD' })" class="flip-button">
            Flip Card
        </button>

        <div class="card-container">
            <Card v-for="card in sampleCards" :id="card.id" :amount="card.amount" :userId="card.userId"
                :cardGameState="cardGameState" />
        </div>

        <div v-if="cardGameState.matches('cardFlipped')" class="card-flipped">
            <p>The card is flipped!</p>
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

        <!-- Side panel with the updated total -->
        <div :class="['side-panel', cardGameState.matches('updatingTotal') ? 'updating' : '']">
            <h2>Total: {{ total }}</h2>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { cardGameMachine } from '../machines/cardGameMachine.ts'
import { ref, watch } from 'vue'
import Card from './Card.vue'
import { sampleCards } from '../data/sampleCards.ts'

interface Card {
    id: string
    userId: string
    amount: number
}

const { snapshot: cardGameState, send } = useMachine(cardGameMachine)
const total = ref<number>(0)
const amountToIncrement = ref<number>(4)
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

const updateTotal = (): void => {
    console.log('updateTotal')
    const newAmount = total.value + amountToIncrement.value
    const interval = setInterval(() => {
        if (total.value < newAmount) {
            total.value += 1
        } else {
            clearInterval(interval)
            send({ type: 'TOTAL_UPDATED' })
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
    flex-direction: column;
    align-items: center;
    padding: 20px;
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
    position: absolute;
    margin-top: 30px;
    padding: 20px;
    background-color: #f39c12;
    color: black;
    width: 250px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 1s, transform 1s;
}

.side-panel.updating {
    opacity: 1;
    transform: translateX(0);
}

.waiting {
    margin-top: 20px;
    font-size: 20px;
}

.waiting button {
    padding: 10px 20px;
    background-color: #8e44ad;
    color: white;
    border: none;
    cursor: pointer;
    margin-top: 20px;
}
</style>