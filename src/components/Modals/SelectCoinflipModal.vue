<template>
  <vue-final-modal v-slot="{ params, close }" v-bind="$attrs" classes="modal-container" content-class="modal-content">
    <span class="modal__title">
      <slot name="title"></slot>
    </span>
    <div class="modal__content">
      <slot :params="params"></slot>
    </div>
    <div class="modal__action">
      <div class="actionButtons">
        <Button class="actionButton" label="Join" @click="$emit('join')"/>
        <Button class="actionButton" label="Cancel" @click="$emit('cancel'); close()"/>
      </div>
    </div>
  </vue-final-modal>
</template>


<script>
import Button from "@/components/Button";

export default {
  name: "SelectCoinflipModal",
    emits: ['cancel', 'join'],
  components: {
    Button,
  },
  inheritAttrs: false,
}
</script>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  min-width: 30%;
  margin: 0 1rem;
  padding: 1rem;
  border: 2px solid #1E242B;
  border-radius: 1em;
  background: #1a1f25;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}

.actionButtons {
  display: grid;
  align-items: center;
  justify-content: space-between;
  width: auto;
  grid-template-columns: 1fr 1fr;
  gap: 0.4em;
}

.actionButton {
  width: auto;
  height: 1.5em;
  padding: 0.4em;
}
</style>

<style scoped>
.dark-mode div ::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
