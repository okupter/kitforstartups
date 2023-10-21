<script>
// @ts-nocheck
// this was brought in from https://github.com/xnimorz/svelte-input-mask/tree/master
// but it wouldn't work out-of-the-box because it was missing TS suppport 

  import { createEventDispatcher, tick, onMount, onDestroy } from 'svelte';
  import { createInput, defaults } from 'input-core';

  export let value = '';
  export let defaultValue = undefined;
  export let reformat = undefined;
  export let maskString = undefined;
  export let maskChar = defaults.maskChar;
  export let mask = defaults.mask;
  export let maskFormat = defaults.maskFormat;
  export let alwaysShowMask = false;
  export let showMask = false;

  const KEYBOARD = {
    BACKSPACE: 8,
    DELETE: 46,
  };
  const dispatch = createEventDispatcher();

  const input = createInput({
    value: value || defaultValue || '',
    reformat,
    maskString,
    maskChar,
    mask,
    maskFormat,
  });

  let shouldShowMask = alwaysShowMask || showMask;
  $: shouldShowMask = alwaysShowMask || showMask;
  $: input.setReformat(reformat);
  $: input.setMaskFormat(maskFormat);
  $: input.setMask(mask);
  $: input.setMaskString(maskString);
  $: input.setMaskChar(maskChar);
  $: value !== undefined && input.setValue(value);

  onMount(() => {
    input.subscribe(applyValue);
  });

  onDestroy(() => {
    input.unsubscribe(applyValue);
  });

  let canSetSelection = false;
  let inputValue = setupInputValue(input.getState());

  let inputEl;

  function setupInputValue({ maskedValue, visibleValue }) {
    if (shouldShowMask && (canSetSelection || alwaysShowMask)) {
      return maskedValue;
    }
    return visibleValue;
  }

  function applyValue({ maskedValue, visibleValue, selection, value }) {
    inputValue = setupInputValue({ maskedValue, visibleValue });
    setSelection(selection);
    dispatchChangeEvent({
      unmasked: reformat
        ? value
        : value
            .filter(item => item.type === 1)
            .map(item => item.char)
            .join(''),
      maskedValue,
      visibleValue,
    });
  }

  async function setSelection({ start, end }) {
    if (!canSetSelection) {
      return;
    }

    await tick();
    inputEl.setSelectionRange(start, end);
    const raf =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      (fn => setTimeout(fn, 0));
    // For android
    raf(() => inputEl.setSelectionRange(start, end));
  }

  function setupSelection() {
    input.setSelection({
      start: inputEl.selectionStart,
      end: inputEl.selectionEnd,
    });
  }

  function getValue() {
    if (showMask && (canSetSelection || alwaysShowMask)) {
      return input.getState().maskedValue;
    } else {
      return input.getState().visibleValue;
    }
  }

  function handleInput(e) {
    const prevValue = getValue();

    // fix conflict by update value in mask model
    if (e.target.value !== prevValue) {
      input.input(e.data);
      setSelection(input.getSelection());
      // Timeout needed for IE
      setTimeout(() => setSelection(input.getSelection()), 0);
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    setupSelection();

    // getData value needed for IE also works in FF & Chrome
    input.paste(e.clipboardData.getData('Text'));
    setSelection(input.getSelection());
    // Timeout needed for IE
    setTimeout(() => setSelection(input.getSelection()), 0);
  }

  function handleKeyPress(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === 'Enter') {
      return;
    }

    e.preventDefault();
    setupSelection();
    input.input(e.key || e.data || String.fromCharCode(e.which));
    setSelection(input.getSelection());
  }

  function handleKeyDown(e) {
    if (e.which === KEYBOARD.BACKSPACE) {
      e.preventDefault();
      setupSelection();
      input.removePreviosOrSelected();
      setSelection(input.getSelection());
    }

    if (e.which === KEYBOARD.DELETE) {
      e.preventDefault();
      setupSelection();
      input.removeNextOrSelected();
      setSelection(input.getSelection());
    }
  }

  function handleFocus(e) {
    canSetSelection = true;
    dispatch('focus', e);
  }

  function handleBlur(e) {
    canSetSelection = false;
    dispatch('blur', e);
  }

  function dispatchChangeEvent({ unmasked, maskedValue, visibleValue }) {
    dispatch('change', {
      element: inputEl,
      inputState: { unmaskedValue: unmasked, maskedValue, visibleValue },
    });
  }
</script>

<input
  {...$$restProps}
  value={inputValue}
  on:input={handleInput}
  on:keydown={handleKeyDown}
  on:keypress={handleKeyPress}
  on:paste={handlePaste}
  on:focus={handleFocus}
  on:blur={handleBlur}
  bind:this={inputEl} />
