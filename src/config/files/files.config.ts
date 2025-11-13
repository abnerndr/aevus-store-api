import * as multipart from '@fastify/multipart';

export class FilesConfig {
  public static multipart(): multipart.FastifyMultipartOptions {
    return {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5mb- max file size
        fieldNameSize: 100, // 100 bytes- max field name size
        fields: 10, // 10 files- max number of fields
        fieldSize: 100, // 100 bytes- max field value size
        files: 5, // 5 files- max number of file
      },
      attachFieldsToBody: false,
    };
  }
}
