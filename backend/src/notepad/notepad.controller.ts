import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NotepadService } from './notepad.service';

interface CreateNoteBody {
  title: string;
  content: string;
}

@Controller('api/notepad')
export class NotepadController {
  constructor(private readonly notepadService: NotepadService) {}

  @Get()
  findAll() {
    return this.notepadService.findAll();
  }

  @Post()
  create(@Body() body: CreateNoteBody) {
    return this.notepadService.create({
      title: body.title ?? '',
      content: body.content ?? '',
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.notepadService.findOne(slug);
  }

  @Put(':slug')
  update(@Param('slug') slug: string, @Body() body: CreateNoteBody) {
    return this.notepadService.update(slug, {
      title: body.title ?? '',
      content: body.content ?? '',
    });
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.notepadService.remove(slug);
  }
}
