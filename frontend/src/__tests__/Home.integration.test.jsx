// src/__tests__/Home.integration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../pages/Home';
import * as todoService from '../services/TodoService';
import '../ToDoList.css';

// MOCK del servizio addTodo e fetchTodos
jest.mock('../services/TodoService');

describe('Integration test Home', () => {
  beforeEach(() => {
    // Mock iniziale: lista ToDo vuota
    todoService.fetchTodos.mockResolvedValue([]);
  });

  test('aggiunge nuovo ToDo e appare nella lista', async () => {
    const newTodo = {
      id: '123',
      title: 'Test Todo',
      description: 'Descrizione test',
      priority: 'medium',
      status: 'pending',
      due_date: null,
    };

    // Mock addTodo: restituisce nuovo todo
    todoService.addTodo.mockResolvedValue(newTodo);
    // Mock fetchTodos aggiornato dopo aggiunta: contiene nuovo todo
    todoService.fetchTodos
      .mockResolvedValueOnce([]) // primo caricamento vuoto
      .mockResolvedValueOnce([newTodo]); // dopo aggiunta todo

    render(<Home />);

    // Attendi caricamento iniziale
    await waitFor(() =>
      expect(todoService.fetchTodos).toHaveBeenCalledTimes(1)
    );

    // Apri il form cliccando il bottone
    fireEvent.click(screen.getByText(/\+ nuova todo/i));

    // Attendi visualizzazione campo Titolo nel form
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/inserisci il titolo della todo/i)
      ).toBeInTheDocument();
    });

    // Inserisci titolo e descrizione
    fireEvent.change(
      screen.getByPlaceholderText(/inserisci il titolo della todo/i),
      {
        target: { value: 'Test Todo' },
      }
    );

    fireEvent.change(screen.getByPlaceholderText(/descrizione opzionale/i), {
      target: { value: 'Descrizione test' },
    });

    // Invia il form
    fireEvent.click(screen.getByRole('button', { name: /aggiungi todo/i }));

    // Attendi che la lista venga aggiornata e mostri il nuovo ToDo
    expect(await screen.findByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Descrizione test')).toBeInTheDocument();
  });
});
