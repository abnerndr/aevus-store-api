import { BadRequestException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { CloudflareService } from 'src/externals/cloudflare/cloudflare.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface UploadedFileResult {
  url: string;
  key: string;
  originalName: string;
  size: number;
  mimetype: string;
}

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('api/uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Post()
  @ApiOperation({ summary: 'Upload de uma ou mais imagens para o storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (jpg, png, webp, gif)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo(s) enviado(s) com sucesso',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              url: { type: 'string' },
              key: { type: 'string' },
              originalName: { type: 'string' },
              size: { type: 'number' },
              mimetype: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async uploadFiles(@Req() req: FastifyRequest): Promise<{ files: UploadedFileResult[] }> {
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    const results: UploadedFileResult[] = [];

    if (!req.isMultipart()) {
      throw new BadRequestException('A requisição deve ser multipart/form-data');
    }

    const files = req.files();

    for await (const part of files) {
      if (!ALLOWED_MIME_TYPES.includes(part.mimetype)) {
        throw new BadRequestException(
          `Tipo de arquivo não permitido: ${part.mimetype}. Use jpeg, png, webp ou gif.`,
        );
      }

      const buffer = await part.toBuffer();

      if (buffer.length === 0) {
        throw new BadRequestException('Arquivo vazio recebido');
      }

      const fileKey = this.cloudflareService.normalizeFileKey(part.filename);

      await this.cloudflareService.putObject(fileKey, buffer, part.mimetype);

      const url = await this.cloudflareService.getPublicUrl(fileKey);

      results.push({
        url,
        key: fileKey,
        originalName: part.filename,
        size: buffer.length,
        mimetype: part.mimetype,
      });
    }

    if (results.length === 0) {
      throw new BadRequestException('Nenhum arquivo recebido');
    }

    return { files: results };
  }
}
