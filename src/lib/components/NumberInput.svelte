<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import MaskInput from './MaskInput.svelte';

  export let value = undefined as any;
  export let defaultValue = undefined as any;

  let inputValue = value || defaultValue || '';
  const dispatch = createEventDispatcher();

  $: inputValue = value || defaultValue || '';

  function reformat({ value, input = '', selection }: { value: any, input: any, selection: any}) {
    const newSelection = {
      start: selection.start,
      end: selection.end,
    };

    let data = removeSelectedRange(value.replace(/(\D)/g, (text: string) => (text === ' ' ? ' ' : '')), newSelection);
    const inputValue = input.replace(/\D/g, '');
    const oldLength = data.length;

    data = data.slice(0, newSelection.start) + inputValue + data.slice(newSelection.start, data.length);
    const spaces = data.match(/\s/g) || [];
    let oldSpacesCount = spaces.length;
    let newSpacesCount = 0;
    data = data.replace(/\s/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, (text: string) => {
      newSpacesCount++;
      return `${text} `;
    });

    let index = newSelection.start + Math.min(0, newSpacesCount - oldSpacesCount);
    if (inputValue) {
      index = Math.max(0, data.length - oldLength + index);
    }
    newSelection.end = newSelection.start = index;

    return {
      value: data,
      maskedValue: data,
      visibleValue: data,
      selection: newSelection,
    };
  }

  function removeSelectedRange(value: any, selection: any) {
    if (selection.start === selection.end) {
      return value;
    }

    if (selection.end < selection.start) {
      const tmp = selection.end;
      selection.end = selection.start;
      selection.start = tmp;
    }

    if (value.length > selection.start) {
      return value.slice(0, selection.start).concat(value.slice(selection.end, value.length));
    }

    return value;
  }

  function handleLeadingZeros(e: any) {
    inputValue = inputValue.replace(/^[0 ]+$/, '0');

    dispatch('blur', e.detail);
  }

  function handleChange(e: any) {
    inputValue = e.detail.inputState.maskedValue;

    dispatch('change', e.detail);
  }
</script>

<MaskInput {...$$props} value={inputValue} {reformat} on:blur={handleLeadingZeros} on:change={handleChange} />