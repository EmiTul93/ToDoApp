// backend/middleware/validation.js

import Joi from 'joi';

// Middleware di validazione personalizzato
export const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    };

    const toValidate = {};
    if (schema.body) toValidate.body = req.body;
    if (schema.params) toValidate.params = req.params;
    if (schema.query) toValidate.query = req.query;
    if (schema.headers) toValidate.headers = req.headers;

    const schemaToValidate = Joi.object(schema);
    const { error, value } = schemaToValidate.validate(
      toValidate,
      validationOptions
    );

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      return res.status(400).json({
        message: 'Errore di validazione',
        details: errorMessage,
        errors: error.details,
      });
    }

    if (value.body) req.body = value.body;
    if (value.params) req.params = value.params;
    if (value.query) req.query = value.query;
    if (value.headers) req.headers = value.headers;

    next();
  };
};

export const validateBody = (schema) => validate({ body: schema });
export const validateParams = (schema) => validate({ params: schema });
export const validateQuery = (schema) => validate({ query: schema });
