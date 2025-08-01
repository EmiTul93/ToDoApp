import React, { useEffect, useState } from "react";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";

// Valori ENUM per priority e status
const PRIORITY_OPTIONS = [
  { value: "low", label: "Bassa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Attiva" },
  { value: "completed", label: "Completata" },
  // aggiungi 'in_progress' se usi anche quello
];

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "", // stringa vuota per input date
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      setError("");
      try {
        setTodos(await fetchTodos());
      } catch (err) {
        setError("Errore durante il caricamento");
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newTodo = await addTodo({
        title: form.title.trim(),
        description: form.description.trim() || "",
        priority: form.priority, // select obbligatoria
        status: form.status, // select obbligatoria
        due_date: form.due_date || null, // opzionale
      });
      setTodos([newTodo, ...todos]);
      setForm({
        title: "",
        description: "",
        priority: "medium", // resetta ai default
        status: "pending",
        due_date: "", // resetta anche la data
      });
    } catch (err) {
      setError("Errore nell'aggiunta");
      // Vedi la risposta vera:
      console.error("Errore dettagliato:", err?.response?.data || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler cancellare?")) return;
    setError("");
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch {
      setError("Errore durante la cancellazione");
    }
  };

  // Funzione per formattare la data in modo leggibile (es. 2025-08-31 → 31/08/2025)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("it-IT");
  };

  return (
    <div className="home-container">
      <h1>Le mie ToDo</h1>
      <div className="home-todolist-wrapper">
        <form onSubmit={handleAdd}>
          <input
            name="title"
            placeholder="Cosa devo fare?"
            value={form.title}
            onChange={handleChange}
            required
            autoComplete="off"
            maxLength={100}
          />
          <input
            name="description"
            placeholder="Descrizione"
            value={form.description}
            onChange={handleChange}
            maxLength={500}
          />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]} // non permettere date nel passato
          />
          <button type="submit">Aggiungi</button>
        </form>

        {error && <div style={{ color: "red", margin: "1rem" }}>{error}</div>}

        {loading ? (
          <div>Caricamento...</div>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                <b>{todo.title}</b> - {todo.description}
                <span>
                  {" "}
                  [
                  {
                    PRIORITY_OPTIONS.find((opt) => opt.value === todo.priority)
                      ?.label
                  }
                  ]
                </span>
                <span>
                  {" "}
                  -{" "}
                  <i>
                    {
                      STATUS_OPTIONS.find((opt) => opt.value === todo.status)
                        ?.label
                    }
                  </i>
                </span>
                {todo.due_date && (
                  <span> - Scadenza: {formatDate(todo.due_date)}</span>
                )}
                <button onClick={() => handleDelete(todo.id)}>Elimina</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
