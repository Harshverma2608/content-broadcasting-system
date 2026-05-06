/**
 * Content Service
 * All content-related API calls go here.
 * Replace mock logic with real API calls when backend is ready.
 */
import { MOCK_CONTENT, generateId } from '../utils/mockData';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const contentService = {
  // Get all content (principal)
  async getAllContent(filters = {}) {
    await delay(600);
    let data = [...MOCK_CONTENT];

    if (filters.status && filters.status !== 'all') {
      data = data.filter((c) => c.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q)
      );
    }

    return data;
  },

  // Get content by teacher
  async getTeacherContent(teacherId) {
    await delay(600);
    return MOCK_CONTENT.filter((c) => c.teacherId === teacherId);
  },

  // Get single content item
  async getContentById(id) {
    await delay(300);
    const item = MOCK_CONTENT.find((c) => c.id === id);
    if (!item) throw new Error('Content not found.');
    return item;
  },

  // Get active content for live page
  async getLiveContent(teacherId) {
    await delay(500);
    const now = new Date();
    return MOCK_CONTENT.filter((c) => {
      if (c.teacherId !== teacherId) return false;
      if (c.status !== 'approved') return false;
      const start = new Date(c.startTime);
      const end = new Date(c.endTime);
      return now >= start && now <= end;
    });
  },

  // Upload new content
  async uploadContent(teacherId, teacherName, formData) {
    await delay(1000);

    // Simulate occasional upload failure for testing
    // if (Math.random() < 0.1) throw new Error('Upload failed. Please try again.');

    const file = formData.file;
    const fileUrl = file
      ? URL.createObjectURL(file)
      : `https://picsum.photos/seed/${Date.now()}/800/600`;

    const newItem = {
      id: generateId(),
      teacherId,
      teacherName,
      title: formData.title,
      subject: formData.subject,
      description: formData.description || '',
      fileUrl,
      fileName: file?.name || 'upload.jpg',
      fileType: file?.type || 'image/jpeg',
      startTime: formData.startTime,
      endTime: formData.endTime,
      rotationDuration: Number(formData.rotationDuration) || 30,
      status: 'pending',
      rejectionReason: null,
      createdAt: new Date().toISOString(),
    };

    MOCK_CONTENT.unshift(newItem);
    return newItem;
  },

  // Get pending content (principal)
  async getPendingContent() {
    await delay(500);
    return MOCK_CONTENT.filter((c) => c.status === 'pending');
  },

  // Get stats
  async getStats() {
    await delay(400);
    const total = MOCK_CONTENT.length;
    const pending = MOCK_CONTENT.filter((c) => c.status === 'pending').length;
    const approved = MOCK_CONTENT.filter((c) => c.status === 'approved').length;
    const rejected = MOCK_CONTENT.filter((c) => c.status === 'rejected').length;
    return { total, pending, approved, rejected };
  },

  // Get teacher stats
  async getTeacherStats(teacherId) {
    await delay(400);
    const items = MOCK_CONTENT.filter((c) => c.teacherId === teacherId);
    return {
      total: items.length,
      pending: items.filter((c) => c.status === 'pending').length,
      approved: items.filter((c) => c.status === 'approved').length,
      rejected: items.filter((c) => c.status === 'rejected').length,
    };
  },
};
