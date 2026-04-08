import { PartialType } from '@nestjs/swagger';
import { CreatePromotionDTO } from './create-promotion.dto';

export class UpdatePromotionDTO extends PartialType(CreatePromotionDTO) {}
