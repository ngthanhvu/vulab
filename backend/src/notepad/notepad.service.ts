import { Injectable, NotFoundException } from '@nestjs/common';
import {
  createNote,
  getAllNotes,
  getNoteBySlug,
  updateNote,
  deleteNote,
  type Note,
} from '../models/noteStore';

export interface CreateNoteDto {
  title: string;
  content: string;
}

export interface NoteResponse {
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}

@Injectable()
export class NotepadService {
  async create(dto: CreateNoteDto): Promise<NoteResponse> {
    const note = await createNote(dto.title, dto.content);
    return this.toResponse(note);
  }

  async findAll(): Promise<NoteResponse[]> {
    const notes = await getAllNotes();
    return notes.map((note) => this.toResponse(note));
  }

  async findOne(slug: string): Promise<NoteResponse> {
    const note = await getNoteBySlug(slug);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return this.toResponse(note);
  }

  async update(slug: string, dto: CreateNoteDto): Promise<NoteResponse> {
    const note = await updateNote(slug, dto.title, dto.content);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return this.toResponse(note);
  }

  async remove(slug: string): Promise<{ success: boolean }> {
    const deleted = await deleteNote(slug);
    if (!deleted) {
      throw new NotFoundException('Note not found');
    }
    return { success: true };
  }

  private toResponse(note: Note): NoteResponse {
    return {
      slug: note.slug,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      url: `/notepad/${note.slug}`,
    };
  }
}
