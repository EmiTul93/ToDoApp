import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem';

test('Renderizza titolo', () => {
  render(<TodoItem todo={{ title: 'Ciao' }} onDelete={() => {}} onUpdate={() => {}} />);
  expect(screen.getByText('Ciao')).toBeInTheDocument();
});

test('onDelete viene chiamato al click', () => {
  const handleDelete = jest.fn();
  render(<TodoItem todo={{ title: 'Test' }} onDelete={handleDelete} onUpdate={() => {}} />);
  fireEvent.click(screen.getByLabelText(/elimina/i));
  expect(handleDelete).toHaveBeenCalled();
});
