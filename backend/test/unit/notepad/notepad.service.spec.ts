import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NotepadService } from '../../../src/notepad/notepad.service';
import * as noteStore from '../../../src/models/noteStore';

jest.mock('../../../src/models/noteStore');

describe('NotepadService', () => {
  let service: NotepadService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotepadService],
    }).compile();

    service = module.get<NotepadService>(NotepadService);
  });

  describe('create', () => {
    it('should create a note and return response', async () => {
      const note = {
        id: 1,
        slug: 'abc123',
        title: 'Hello',
        content: 'World',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      jest.spyOn(noteStore, 'createNote').mockResolvedValueOnce(note);

      const result = await service.create({ title: 'Hello', content: 'World' });

      const { id: _id, ...expectedCreate } = note;
      void _id;
      expect(result).toEqual({
        ...expectedCreate,
        url: `/notepad/${note.slug}`,
      });
      expect(noteStore.createNote).toHaveBeenCalledWith('Hello', 'World');
    });
  });

  describe('findOne', () => {
    it('should return a note by slug', async () => {
      const note = {
        id: 1,
        slug: 'abc123',
        title: 'Hello',
        content: 'World',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };
      jest.spyOn(noteStore, 'getNoteBySlug').mockResolvedValueOnce(note);

      const result = await service.findOne('abc123');

      const { id: _idFind, ...expectedFind } = note;
      void _idFind;
      expect(result).toEqual({
        ...expectedFind,
        url: `/notepad/${note.slug}`,
      });
      expect(noteStore.getNoteBySlug).toHaveBeenCalledWith('abc123');
    });

    it('should throw NotFoundException when note does not exist', async () => {
      jest.spyOn(noteStore, 'getNoteBySlug').mockResolvedValueOnce(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a note and return response', async () => {
      const note = {
        id: 1,
        slug: 'abc123',
        title: 'Updated',
        content: 'Content',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      };
      jest.spyOn(noteStore, 'updateNote').mockResolvedValueOnce(note);

      const result = await service.update('abc123', {
        title: 'Updated',
        content: 'Content',
      });

      const { id: _idUpdate, ...expectedUpdate } = note;
      void _idUpdate;
      expect(result).toEqual({
        ...expectedUpdate,
        url: `/notepad/${note.slug}`,
      });
      expect(noteStore.updateNote).toHaveBeenCalledWith(
        'abc123',
        'Updated',
        'Content',
      );
    });

    it('should throw NotFoundException when note does not exist', async () => {
      jest.spyOn(noteStore, 'updateNote').mockResolvedValueOnce(null);

      await expect(
        service.update('missing', { title: 'Updated', content: 'Content' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a note and return success', async () => {
      jest.spyOn(noteStore, 'deleteNote').mockResolvedValueOnce(true);

      const result = await service.remove('abc123');

      expect(result).toEqual({ success: true });
      expect(noteStore.deleteNote).toHaveBeenCalledWith('abc123');
    });

    it('should throw NotFoundException when note does not exist', async () => {
      jest.spyOn(noteStore, 'deleteNote').mockResolvedValueOnce(false);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
