import { Module } from '@nestjs/common';
import { NotepadController } from './notepad.controller';
import { NotepadService } from './notepad.service';

@Module({
  controllers: [NotepadController],
  providers: [NotepadService],
  exports: [NotepadService],
})
export class NotepadModule {}
