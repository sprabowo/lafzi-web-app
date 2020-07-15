import React from 'react';
import { render } from '@testing-library/react';
import App, { Fetcher } from './App';

test("render Fetcher with loading status", () => {
  const { queryByText } = render(<Fetcher status="loading" ayats={[]} />);
  expect(queryByText(/result/i)).toBeNull();
})

test("render Fetcher with success status but not found", () => {
  const { queryByText } = render(<Fetcher status="success" ayats={[]} />);
  expect(queryByText(/no result/i)).toBeInTheDocument();
})