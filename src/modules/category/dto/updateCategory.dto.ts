import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './createCategory.dto';

// ** Нам то тут кроме имени менять то нечего так что просто  берем все с CreateCategoryDto
// * ну как все, только название получается */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
