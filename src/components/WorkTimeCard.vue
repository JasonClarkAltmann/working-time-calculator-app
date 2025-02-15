<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import { Panel, useToast } from 'primevue'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import { Minus, Plus } from 'lucide-vue-next'

const toast = useToast()

const startHours = ref<number>(7)
const startMinutes = ref<number>(0)
const workHours = ref<number>(0)
const workMinutes = ref<number>(0)
const endHours = ref<number>(0)
const endMinutes = ref<number>(0)
const result = ref<string>('')

const padTime = (num: number): string => {
    return num.toString().padStart(2, '0')
}

const calculate = () => {
    const startH = startHours.value
    const startM = startMinutes.value

    if (workHours.value > 0 || workMinutes.value > 0) {
        const totalMinutes = startM + workMinutes.value
        const extraHours = Math.floor(totalMinutes / 60)
        const finalMinutes = totalMinutes % 60

        let totalHours = startH + workHours.value + extraHours
        totalHours %= 24

        endHours.value = totalHours
        endMinutes.value = finalMinutes

        result.value = `Feierabend: ${padTime(totalHours)}:${padTime(finalMinutes)} Uhr`

        toast.add({
            severity: 'success',
            summary: 'Feierabend berechnet',
            detail: result.value,
            life: 3000,
        })
    } else if (endHours.value > 0 || endMinutes.value > 0) {
        const startTotal = startH * 60 + startM
        const endTotal = endHours.value * 60 + endMinutes.value

        let duration = endTotal - startTotal
        if (duration < 0) duration += 1440

        workHours.value = Math.floor(duration / 60)
        workMinutes.value = duration % 60

        result.value = `Arbeitsdauer: ${workHours.value}h ${padTime(workMinutes.value)}m`

        toast.add({
            severity: 'success',
            summary: 'Arbeitsdauer berechnet',
            detail: result.value,
            life: 3000,
        })
    } else {
        result.value = 'Bitte entweder Arbeitsdauer oder Feierabend eingeben!'

        toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: result.value,
            life: 3000,
        })
    }
}
</script>

<template>
    <Panel class="w-fit m-4">
        <template #header>
            <div class="flex flex-col w-full">
                <h2 class="text-3xl font-bold">Jasons Arbeitszeitrechner:</h2>
                <Divider />
            </div>
        </template>
        <div class="flex flex-col items-center justify-center">
            <div class="text-xl mb-2 font-bold">Wann bist du heute zur Arbeit?</div>
            <div class="flex flex-row gap-4 items-center justify-center">
                <InputNumber
                    v-model="startHours"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="23"
                >
                    <template #incrementicon>
                        <Plus />
                    </template>
                    <template #decrementicon>
                        <Minus />
                    </template>
                </InputNumber>
                <div class="text-2xl font-bold">:</div>
                <InputNumber
                    v-model="startMinutes"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="59"
                >
                    <template #incrementicon>
                        <Plus />
                    </template>
                    <template #decrementicon>
                        <Minus />
                    </template>
                </InputNumber>
                <div class="text-2xl font-bold">Uhr</div>
            </div>
            <Divider />
            <div class="text-xl mb-2 font-bold">Wie lange willst du heute arbeiten?</div>
            <div class="flex flex-row gap-4 items-center justify-center">
                <InputNumber
                    v-model="workHours"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="23"
                >
                    <template #incrementicon>
                        <Plus />
                    </template>
                    <template #decrementicon>
                        <Minus />
                    </template>
                </InputNumber>
                <div class="text-2xl font-bold">h</div>
                <InputNumber
                    v-model="workMinutes"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="59"
                >
                    <template #incrementicon>
                        <Plus />
                    </template>
                    <template #decrementicon>
                        <Minus />
                    </template>
                </InputNumber>
                <div class="text-2xl font-bold">min</div>
            </div>
            <Divider />
            <div class="text-xl mb-2 font-bold">Wie lange willst du heute arbeiten?</div>
            <div class="flex flex-row gap-4 items-center justify-center">
                <InputNumber
                    v-model="endHours"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="23"
                >
                    <template #incrementicon>
                        <Plus />
                    </template>
                    <template #decrementicon>
                        <Minus />
                    </template>
                </InputNumber>
                <div class="text-2xl font-bold">:</div>
                <InputNumber
                    v-model="endMinutes"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="59"
                >
                    <template #incrementicon>
                        <Plus />
                    </template>
                    <template #decrementicon>
                        <Minus />
                    </template>
                </InputNumber>
                <div class="text-2xl font-bold">Uhr</div>
            </div>
            <Divider />
            <Button class="w-full" @click="calculate" label="Berechne Arbeitszeit" />
        </div>
    </Panel>
</template>
