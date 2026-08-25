import { Test, TestingModule } from '@nestjs/testing';
import { NotepadController } from '../../../src/notepad/notepad.controller';
import { NotepadService } from '../../../src/notepad/notepad.service';

describe('NotepadController', () => {
  let controller: NotepadController;
  let service: NotepadService;

  const mockNote = {
    slug: 'abc123',
    title: 'Hello',
    content: 'World',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    url: '/notepad/abc123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotepadController],
      providers: [
        {
          provide: NotepadService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockNote),
            findOne: jest.fn().mockResolvedValue(mockNote),
            update: jest.fn().mockResolvedValue(mockNote),
            remove: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<NotepadController>(NotepadController);
    service = module.get<NotepadService>(NotepadService);
  });

  describe('create', () => {
    it('should create a note with default values when body is empty', async () => {
      const result = await controller.create({ title: undefined as unknown as string, content: undefined as unknown as string });

      expect(service.create).toHaveBeenCalledWith({ title: '', content: '' });
      expect(result).toEqual(mockNote);
    });

    it('should create a note with provided values', async () => {
      const result = await controller.create({
        title: 'Hello',
        content: 'World',
      });

      expect(service.create).toHaveBeenCalledWith({
        title: 'Hello',
        content: 'World',
      });
      expect(result).toEqual(mockNote);
    });
  });

  describe('findOne', () => {
    it('should return a note by slug', async () => {
      const result = await controller.findOne('abc123');

      expect(service.findOne).toHaveBeenCalledWith('abc123');
      expect(result).toEqual(mockNote);
    });
  });

  describe('update', () => {
    it('should update a note by slug', async () => {
      const result = await controller.update('abc123', {
        title: 'Updated',
        content: 'Content',
      });

      expect(service.update).toHaveBeenCalledWith('abc123', {
        title: 'Updated',
        content: 'Content',
      });
      expect(result).toEqual(mockNote);
    });

    it('should use default values when body fields are missing', async () => {
      await controller.update('abc123', {
        title: undefined as unknown as string,
        content: undefined as unknown as string,
      });

      expect(service.update).toHaveBeenCalledWith('abc123', {
        title: '',
        content: '',
      });
    });
  });

  describe('remove', () => {
    it('should delete a note by slug', async () => {
      const result = await controller.remove('abc123');

      expect(service.remove).toHaveBeenCalledWith('abc123');
      expect(result).toEqual({ success: true });
    });
  });
});
