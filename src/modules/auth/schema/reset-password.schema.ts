import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ResetPasswordSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
};
