import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('should generate a slug of the requested length', () => {
    const slug = generateSlug(12);
    expect(slug).toHaveLength(12);
  });

  it('should only contain lowercase letters and digits', () => {
    const slug = generateSlug(20);
    expect(slug).toMatch(/^[a-z0-9]+$/);
  });

  it('should generate unique slugs', () => {
    const slugs = new Set(Array.from({ length: 100 }, () => generateSlug(10)));
    expect(slugs.size).toBeGreaterThan(90);
  });
});
