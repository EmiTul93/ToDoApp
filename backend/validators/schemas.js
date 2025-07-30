import Joi from 'joi';

// Schema per registrazione
export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email non valida',
      'any.required': 'Email obbligatoria'
    }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
    .required()
    .messages({
      'string.min': 'Password deve avere almeno 8 caratteri',
      'string.pattern.base': 'Password deve contenere almeno: 1 minuscola, 1 maiuscola, 1 numero, 1 carattere speciale',
      'any.required': 'Password obbligatoria'
    })
});

// Schema per login
export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email non valida',
      'any.required': 'Email obbligatoria'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password obbligatoria'
    })
});

// Schema per creazione ToDo
export const createTodoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Titolo non può essere vuoto',
      'string.max': 'Titolo massimo 100 caratteri',
      'any.required': 'Titolo obbligatorio'
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Descrizione massimo 500 caratteri'
    }),
  due_date: Joi.date()
    .iso()
    .min('now')
    .allow(null)
    .messages({
      'date.iso': 'Data non valida',
      'date.min': 'La data non può essere nel passato'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium')
    .messages({
      'any.only': 'Priorità deve essere: low, medium, high'
    }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .default('pending')
    .messages({
      'any.only': 'Status deve essere: pending, in_progress, completed'
    })
});

// Schema per aggiornamento ToDo
export const updateTodoSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .messages({
      'string.min': 'Titolo non può essere vuoto',
      'string.max': 'Titolo massimo 100 caratteri'
    }),
  description: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Descrizione massimo 500 caratteri'
    }),
  due_date: Joi.date()
    .iso()
    .allow(null)
    .messages({
      'date.iso': 'Data non valida'
    }),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .messages({
      'any.only': 'Priorità deve essere: low, medium, high'
    }),
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed')
    .messages({
      'any.only': 'Status deve essere: pending, in_progress, completed'
    })
}).min(1);

// Schema per ID parametri
export const idSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID deve essere un numero',
      'number.integer': 'ID deve essere un numero intero',
      'number.positive': 'ID deve essere positivo',
      'any.required': 'ID obbligatorio'
    })
});
