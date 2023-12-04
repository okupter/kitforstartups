<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import MaskInput from './MaskInput.svelte';
	import type { IInputValue, ISelectRange } from 'input-core';
  
  export let value = undefined as any;
  export let defaultValue = undefined as any;

  let inputValue = value || defaultValue || '';
  const dispatch = createEventDispatcher();
  
  $: inputValue = value || defaultValue || '';
  
  const reformat = ({ value, input = '', selection }: { value: any, input: string, selection: ISelectRange }) => {
    const newSelection = {
      start: selection.start,
      end: selection.end,
    };
    
    console.log('reformat', value, input, selection);
    
    let data = removeSelectedRange(value.replace(/(\D)/g, (text: string) => (text === ' ' ? ' ' : '')), newSelection);
    if (!data) data = '0';
    
    // const inputValue = input.replace(/\D/g, '');
    const inputValue = input;
    const oldLength = data.length;

    data = data.slice(0, newSelection.start) + input + data.slice(newSelection.start, data.length);
    // const spaces = data.match(/\s/g) || [];
    // let oldSpacesCount = spaces.length;
    // let newSpacesCount = 0;
    // data = data.replace(/\s/g, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, (text: string) => {
    //   newSpacesCount++;
    //   return `${text} `;
    // });

    let index = newSelection.start;
    if (inputValue) {
      index = Math.max(0, data.length - oldLength + index);
    }
    newSelection.end = newSelection.start = index;
    
    if (!data.includes('$') || !data.includes('.')) data = `$${data}.00`;
    
    return {
      value: data,
      maskedValue: data,
      visibleValue: data,
      selection: newSelection,
    };
  }
  
  const removeSelectedRange = (value: any, selection: any) => {
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
  }
  
  const handleLeadingZeros = (e: any) => {
    inputValue = inputValue.replace(/^[0 ]+$/, '0');
    // inputValue = inputValue[inputValue.length - 1] === '.' ? inputValue + '00' : inputValue;
    
    dispatch('blur', e.detail);
  }
  
  const handleChange = (e: any) => {
    const state = {...e.detail.inputState};
    console.dir(state);
    
    inputValue = e.detail.inputState.unmaskedValue;
    
    dispatch('change', e.detail);
  }
</script>

<!-- <MaskInput {...$$props}
  size={($$props.size || 0) + 3}
  value={inputValue}
  {reformat}
  on:blur={handleLeadingZeros}
  on:change={handleChange} /> -->
  
<MaskInput {...$$props}
  size={($$props.size || 0) + 4}
  value={inputValue}
  mask="$000.00"
  showMask={false}
  on:blur={handleLeadingZeros}
  on:change={handleChange} />
  