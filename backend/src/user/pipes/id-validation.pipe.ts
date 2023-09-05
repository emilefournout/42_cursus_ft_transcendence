import { PipeTransform, BadRequestException } from '@nestjs/common';

export class IdValidationPipe implements PipeTransform {
  transform(value: any) {
    const id = parseInt(value, 10);

    if (isNaN(id) || id < 2) {
      throw new BadRequestException('Invalid id');
    }

    return id;
  }
}
