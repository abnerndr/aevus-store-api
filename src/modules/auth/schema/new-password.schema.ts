import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const NewPasswordSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    token: { type: 'string' },
    password: { type: 'string', minLength: 6 },
  },
  required: ['token', 'password'],
};
