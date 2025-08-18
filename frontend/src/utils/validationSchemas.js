import * as yup from 'yup';

// Schema per login
export const loginSchema = yup.object({
  email: yup.string().email('Email non valida').required('Email obbligatoria'),
  password: yup.string().required('Password obbligatoria'),
});

// Schema per registrazione
export const registerSchema = yup.object({
  email: yup.string().email('Email non valida').required('Email obbligatoria'),
  password: yup
    .string()
    .min(8, 'Password deve avere almeno 8 caratteri')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
      'Password deve contenere almeno: 1 minuscola, 1 maiuscola, 1 numero, 1 carattere speciale'
    )
    .required('Password obbligatoria'),
});

// Schema per creazione ToDo
export const createTodoSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(1, 'Titolo non può essere vuoto')
    .max(100, 'Titolo massimo 100 caratteri')
    .required('Titolo obbligatorio'),
  description: yup
    .string()
    .max(500, 'Descrizione massimo 500 caratteri')
    .nullable(),
  due_date: yup
    .date()
    .min(new Date(), 'La data non può essere nel passato')
    .nullable(),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high'], 'Priorità non valida')
    .default('medium'),
  status: yup
    .string()
    .oneOf(['pending', 'in_progress', 'completed'], 'Status non valido')
    .default('pending'),
});

// Schema per aggiornamento ToDo
export const updateTodoSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(1, 'Titolo non può essere vuoto')
    .max(100, 'Titolo massimo 100 caratteri'),
  description: yup
    .string()
    .max(500, 'Descrizione massimo 500 caratteri')
    .nullable(),
  due_date: yup.date().nullable(),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high'], 'Priorità non valida'),
  status: yup
    .string()
    .oneOf(['pending', 'in_progress', 'completed'], 'Status non valido'),
});
