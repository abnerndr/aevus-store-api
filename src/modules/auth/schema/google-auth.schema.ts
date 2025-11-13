import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const GoogleAuthSchema: SchemaObject | ReferenceObject = {
  type: 'object',
  properties: {
    googleToken: { type: 'string' },
  },
  required: ['googleToken'],
};
