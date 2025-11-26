<template>
  <div class="formula-line">
    <transition-group name="term" tag="div" class="side left">
      <div
        v-for="t in leftList"
        :key="t.id"
        class="term"
        @click="onClick(t.id, 'left')"
        :title="t.text"
      >
        <span class="sign" v-if="t.displaySign">{{ t.displaySign }}</span>
        <span class="text">{{ t.text }}</span>
      </div>
    </transition-group>

    <div class="equals">=</div>

    <transition-group name="term" tag="div" class="side right">
      <div
        v-for="t in rightList"
        :key="t.id"
        class="term"
        @click="onClick(t.id, 'right')"
        :title="t.text"
      >
        <span class="sign" v-if="t.displaySign">{{ t.displaySign }}</span>
        <span class="text">{{ t.text }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

// Define props once and use them
const props = defineProps({
  left: { type: Array, required: true },
  right: { type: Array, required: true },
})
const state = reactive({
  leftList: props.left.map((t) => ({ ...t, displaySign: t.sign })),
  rightList: props.right.map((t) => ({ ...t, displaySign: t.sign })),
})

function invertSign(s) {
  if (!s) return ''
  return s === '+' ? '-' : '+'
}

function onClick(id, side) {
  // find clicked term
  const all = [...state.leftList, ...state.rightList]
  const clicked = all.find((x) => x.id === id)
  if (!clicked) return
  // New behavior: clicked term always moves to the LEFT side.
  // Left will contain only the clicked term; right contains all others (with inverted signs).
  const newLeft = [{ ...clicked, displaySign: clicked.sign || '' }]
  const others = all.filter((x) => x.id !== id)
  const newRight = others.map((o) => ({ ...o, displaySign: invertSign(o.sign) }))
  state.leftList = newLeft
  state.rightList = newRight
}

const { leftList, rightList } = toRefs(state)
</script>

<style scoped>
.formula-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 16px 0;
}
.side {
  display: flex;
  gap: 8px;
  min-width: 120px;
  flex-wrap: wrap;
}
.equals {
  font-weight: 800;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}
.term {
  background: #eef6ff;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition:
    transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
    background 220ms;
}
.term:hover {
  background: #d7ecff;
}
.sign {
  font-weight: 700;
  color: #333;
}
.text {
  font-weight: 600;
}

/* transition-group move animation */
.term-move {
  transition: transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
}
</style>
