import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const LoginSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
  example: {
    email: 'admin@example.com',
    password: 'admin123',
  },
  required: ['email', 'password'],
};
