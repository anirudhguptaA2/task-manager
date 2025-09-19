<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,0.3)] backdrop-blur-sm flex items-center justify-center z-2000">
    <div class="bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] py-6 px-8 min-w-65 max-w-[90vw] flex flex-col items-center">
      <h4 class="mb-4">Edit {{ type === 'status' ? 'Status' : 'Priority' }}</h4>
      <input class="w-full py-2 px-3 border border-gray-300 rounded-md text-base mb-4" v-model="localValue" type="text" />
      <div class="flex items-center gap-3 mb-4">
        <label class="font-medium">Color:</label>
        <input type="color" v-model="localColor" />
      </div>
      <div class="flex gap-4 justify-end w-full">
        <button class="py-2 px-5 border-none rounded-md bg-[#ef4444] text-[#fff] font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#dc2626]" @click="$emit('save', localValue, localColor)">Save</button>
        <button class="py-2 px-5 rounded-md bg-[#ddd] text-[#333] hover:bg-[#bbb]" @click="$emit('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  modelValue: String,
  colorValue: String,
  type: String
});
const emit = defineEmits(['update:modelValue', 'update:colorValue', 'save', 'cancel']);
const localValue = ref(props.modelValue);
const localColor = ref(props.colorValue);

watch(() => props.modelValue, (val) => { localValue.value = val; });
watch(() => props.colorValue, (val) => { localColor.value = val; });
watch(localValue, (val) => { emit('update:modelValue', val); });
watch(localColor, (val) => { emit('update:colorValue', val); });
</script>
