import React from 'react';
import { render } from '@testing-library/react';
import Result from './components/Result';

test("render Result with loading status", () => {
  const { queryByText } = render(<Result status="loading" ayats={[]} />);
  expect(queryByText(/result/i)).toBeNull();
})

test("render Result with success status but not found", () => {
  const { queryByText } = render(<Result status="success" ayats={[]} />);
  expect(queryByText(/no result/i)).toBeInTheDocument();
})