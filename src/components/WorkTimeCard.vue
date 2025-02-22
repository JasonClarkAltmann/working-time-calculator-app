<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import ButtonGroup from 'primevue/buttongroup'
import { Panel, useToast } from 'primevue'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import Tabs from 'primevue/tabs'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import {
    AlarmClock,
    AlarmClockMinus,
    AlarmClockPlus,
    Calculator,
    House,
    RotateCcw,
} from 'lucide-vue-next'

const toast = useToast()
const activeTab = ref('0')

const startHours = ref<number>(8)
const startMinutes = ref<number>(0)
const breakDuration = ref<number>(30)

const endHours0 = ref<number>(startHours.value)
const endMinutes0 = ref<number>(0)
const workHours0 = ref<number>(0)
const workMinutes0 = ref<number>(0)
const overtimeHours0 = ref<number>(0)
const overtimeMinutes0 = ref<number>(0)

const workHours1 = ref<number>(0)
const workMinutes1 = ref<number>(0)
const endHours1 = ref<number>(0)
const endMinutes1 = ref<number>(0)
const overtimeHours1 = ref<number>(0)
const overtimeMinutes1 = ref<number>(0)

const toMinutes = (hours: number, minutes: number): number => hours * 60 + minutes
const toTimeString = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60) % 24
    const minutes = totalMinutes % 60
    return `${padTime(hours)}:${padTime(minutes)}`
}

const padTime = (num: number): string => num.toString().padStart(2, '0')

const calculateOvertime = (netDuration: number, tab: string) => {
    const regularHours = 8 * 60
    const overtimeTotal = netDuration - regularHours

    const absOvertime = Math.abs(overtimeTotal)
    const hours = Math.floor(absOvertime / 60)
    const minutes = absOvertime % 60
    const sign = overtimeTotal >= 0 ? 1 : -1

    if (tab === '0') {
        overtimeHours0.value = hours * sign
        overtimeMinutes0.value = minutes * sign
    } else {
        overtimeHours1.value = hours * sign
        overtimeMinutes1.value = minutes * sign
    }
}

const calculate = () => {
    try {
        if (activeTab.value === '0') {
            overtimeHours0.value = 0
            overtimeMinutes0.value = 0

            const startTotal = toMinutes(startHours.value, startMinutes.value)
            const endTotal = toMinutes(endHours0.value, endMinutes0.value)

            if (endTotal <= 0) throw new Error('Bitte Endzeit eingeben!')

            let duration = endTotal - startTotal
            if (duration < 0) duration += 1440

            const netDuration = duration - breakDuration.value
            workHours0.value = Math.floor(netDuration / 60)
            workMinutes0.value = netDuration % 60

            calculateOvertime(netDuration, '0')

            toast.add({
                severity: 'success',
                summary: 'Arbeitsdauer berechnet',
                detail: `Arbeitsdauer: ${workHours0.value}h ${padTime(workMinutes0.value)}m (inkl. ${breakDuration.value} min Pause)`,
                life: 3000,
            })
        } else {
            overtimeHours1.value = 0
            overtimeMinutes1.value = 0

            const startTotal = toMinutes(startHours.value, startMinutes.value)
            const workTotal = toMinutes(workHours1.value, workMinutes1.value)

            if (workTotal <= 0) throw new Error('Bitte Arbeitsdauer eingeben!')

            const total = startTotal + workTotal + breakDuration.value
            endHours1.value = Math.floor((total % 1440) / 60)
            endMinutes1.value = total % 60

            calculateOvertime(workTotal, '1')

            toast.add({
                severity: 'success',
                summary: 'Feierabend berechnet',
                detail: `Feierabend: ${toTimeString(total)} Uhr (inkl. ${breakDuration.value} min Pause)`,
                life: 3000,
            })
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Fehler',
            detail: error,
            life: 3000,
        })
    }
}

const reset = () => {
    startHours.value = 8
    startMinutes.value = 0
    breakDuration.value = 30
    overtimeHours0.value = 0
    overtimeMinutes0.value = 0
    overtimeHours1.value = 0
    overtimeMinutes1.value = 0
    workHours1.value = 0
    workMinutes1.value = 0
    endHours1.value = 0
    endMinutes1.value = 0
    workHours0.value = 0
    workMinutes0.value = 0
    endHours0.value = 0
    endMinutes0.value = 0
}
</script>

<template>
    <Panel class="w-screen h-screen sm:h-fit sm:w-fit p-4">
        <template #header>
            <div class="flex flex-col">
                <h2 class="text-3xl font-bold">Jasons Arbeitszeitrechner:</h2>
                <Divider />
            </div>
        </template>
        <div class="flex flex-col items-center justify-center">
            <div class="text-xl mb-2 font-bold">Arbeitsbeginn:</div>
            <div class="flex flex-row gap-2 items-center justify-center">
                <InputNumber
                    v-model="startHours"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="23"
                />
                <div class="text-2xl font-bold">:</div>
                <InputNumber
                    v-model="startMinutes"
                    showButtons
                    buttonLayout="vertical"
                    style="width: 3rem"
                    :min="0"
                    :max="59"
                />
                <div class="text-2xl font-bold">Uhr</div>
            </div>

            <Divider />

            <div class="text-xl mb-2 font-bold">Pausenzeit:</div>
            <ButtonGroup class="w-full">
                <Button
                    @click="breakDuration = 0"
                    :outlined="breakDuration !== 0"
                    label="Keine"
                    class="w-full"
                    size="small"
                    rounded
                />
                <Button
                    @click="breakDuration = 30"
                    :outlined="breakDuration !== 30"
                    label="30 min"
                    class="w-full"
                    size="small"
                    rounded
                />
                <Button
                    @click="breakDuration = 45"
                    :outlined="breakDuration !== 45"
                    label="45 min"
                    class="w-full"
                    size="small"
                    rounded
                />
                <Button
                    @click="breakDuration = 60"
                    :outlined="breakDuration !== 60"
                    label="1 h"
                    class="w-full"
                    size="small"
                    rounded
                />
            </ButtonGroup>

            <Divider />

            <ButtonGroup class="w-full">
                <Button
                    @click="activeTab = '0'"
                    :outlined="activeTab !== '0'"
                    label="Feierabend"
                    rounded
                    class="w-full"
                />
                <Button
                    @click="activeTab = '1'"
                    :outlined="activeTab !== '1'"
                    label="Arbeitszeit"
                    rounded
                    class="w-full"
                />
            </ButtonGroup>

            <Tabs v-model:value="activeTab">
                <TabPanels>
                    <TabPanel value="0">
                        <div class="flex flex-col items-center justify-center">
                            <div class="flex flex-row gap-2 items-center justify-center">
                                <InputNumber
                                    v-model="endHours0"
                                    showButtons
                                    buttonLayout="vertical"
                                    style="width: 3rem"
                                    :min="0"
                                    :max="23"
                                />
                                <div class="text-2xl font-bold">:</div>
                                <InputNumber
                                    v-model="endMinutes0"
                                    showButtons
                                    buttonLayout="vertical"
                                    style="width: 3rem"
                                    :min="0"
                                    :max="59"
                                />
                                <div class="text-2xl font-bold">Uhr</div>
                            </div>

                            <Divider />

                            <div class="flex flex-row text-xl font-bold">
                                <House class="mr-2" />
                                <div>
                                    Arbeitsdauer: {{ padTime(workHours0) }}h
                                    {{ padTime(workMinutes0) }}m
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="flex flex-col items-center justify-center">
                            <div class="flex flex-row gap-2 items-center justify-center">
                                <InputNumber
                                    v-model="workHours1"
                                    showButtons
                                    buttonLayout="vertical"
                                    style="width: 3rem"
                                    :min="0"
                                    :max="23"
                                />
                                <div class="text-2xl font-bold">h</div>
                                <InputNumber
                                    v-model="workMinutes1"
                                    showButtons
                                    buttonLayout="vertical"
                                    style="width: 3rem"
                                    :min="0"
                                    :max="59"
                                />
                                <div class="text-2xl font-bold">min</div>
                            </div>

                            <Divider />

                            <div class="flex flex-row text-xl font-bold">
                                <House class="mr-2" />
                                <div>
                                    Feierabend um {{ padTime(endHours1) }}:{{
                                        padTime(endMinutes1)
                                    }}
                                    Uhr
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <div class="flex flex-col w-full gap-2 items-center">
                <div
                    v-if="activeTab === '0'"
                    class="flex flex-row text-xl font-bold justify-center"
                >
                    <AlarmClockPlus v-if="overtimeHours0 + overtimeMinutes0 > 0" class="mr-2" />
                    <AlarmClockMinus
                        v-else-if="overtimeHours0 + overtimeMinutes0 < 0"
                        class="mr-2"
                    />
                    <AlarmClock v-else class="mr-2" />
                    <span v-if="overtimeHours0 !== 0 || overtimeMinutes0 !== 0">
                        {{
                            overtimeHours0 + overtimeMinutes0 > 0 ? 'Überstunden' : 'Minusstunden'
                        }}: {{ padTime(Math.abs(overtimeHours0)) }}h
                        {{ padTime(Math.abs(overtimeMinutes0)) }}m
                    </span>
                    <span v-else>Keine Über-/Minusstunden</span>
                </div>
                <div
                    v-if="activeTab === '1'"
                    class="flex flex-row text-xl font-bold justify-center"
                >
                    <AlarmClockPlus v-if="overtimeHours1 + overtimeMinutes1 > 0" class="mr-2" />
                    <AlarmClockMinus
                        v-else-if="overtimeHours1 + overtimeMinutes1 < 0"
                        class="mr-2"
                    />
                    <AlarmClock v-else class="mr-2" />
                    <span v-if="overtimeHours1 !== 0 || overtimeMinutes1 !== 0">
                        {{
                            overtimeHours1 + overtimeMinutes1 > 0 ? 'Überstunden' : 'Minusstunden'
                        }}: {{ padTime(Math.abs(overtimeHours1)) }}h
                        {{ padTime(Math.abs(overtimeMinutes1)) }}m
                    </span>
                    <span v-else>Keine Über-/Minusstunden</span>
                </div>

                <Divider />

                <Button
                    v-if="
                        activeTab === '0' &&
                        toMinutes(endHours0, endMinutes0) <= toMinutes(startHours, startMinutes)
                    "
                    fluid
                    disabled
                    label="Berechnen"
                >
                    <template #icon>
                        <Calculator />
                    </template>
                </Button>
                <Button
                    v-else-if="activeTab === '1' && toMinutes(workHours1, workMinutes1) <= 0"
                    fluid
                    disabled
                    label="Berechnen"
                >
                    <template #icon>
                        <Calculator />
                    </template>
                </Button>
                <Button v-else fluid @click="calculate" label="Berechnen">
                    <template #icon>
                        <Calculator />
                    </template>
                </Button>
                <Button
                    v-if="
                        activeTab === '0' &&
                        toMinutes(endHours0, endMinutes0) <= toMinutes(startHours, startMinutes)
                    "
                    class="w-min"
                    label="Zurücksetzen"
                    size="small"
                    rounded
                    outlined
                    disabled
                >
                    <template #icon>
                        <RotateCcw />
                    </template>
                </Button>
                <Button
                    v-else-if="activeTab === '1' && toMinutes(workHours1, workMinutes1) <= 0"
                    class="w-min"
                    label="Zurücksetzen"
                    size="small"
                    rounded
                    outlined
                    disabled
                >
                    <template #icon>
                        <RotateCcw />
                    </template>
                </Button>
                <Button
                    v-else
                    class="w-min"
                    @click="reset"
                    label="Zurücksetzen"
                    size="small"
                    rounded
                    outlined
                >
                    <template #icon>
                        <RotateCcw />
                    </template>
                </Button>
            </div>
        </div>
    </Panel>
</template>
