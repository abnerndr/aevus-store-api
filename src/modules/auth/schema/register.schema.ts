import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const RegisterSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    name: { type: 'string' },
  },
  example: {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
  },
  required: ['email', 'password', 'name'],
};
