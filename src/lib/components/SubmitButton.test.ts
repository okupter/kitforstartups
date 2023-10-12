import SubmitButton from './SubmitButton.svelte';
import { render } from '@testing-library/svelte';

test('submit button exists', () => {
  const { getByText } = render(SubmitButton, { props: { text: 'YOLO', running: true }});
  
  expect(getByText('YOLO')).toBeDefined();
});