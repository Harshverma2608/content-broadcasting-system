/**
 * Approval Service
 * All approval-related API calls go here.
 * Replace mock logic with real API calls when backend is ready.
 */
import { MOCK_CONTENT } from '../utils/mockData';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const approvalService = {
  async approveContent(contentId) {
    await delay(700);
    const item = MOCK_CONTENT.find((c) => c.id === contentId);
    if (!item) throw new Error('Content not found.');
    item.status = 'approved';
    item.rejectionReason = null;
    return { ...item };
  },

  async rejectContent(contentId, reason) {
    await delay(700);
    if (!reason || !reason.trim()) {
      throw new Error('Rejection reason is required.');
    }
    const item = MOCK_CONTENT.find((c) => c.id === contentId);
    if (!item) throw new Error('Content not found.');
    item.status = 'rejected';
    item.rejectionReason = reason.trim();
    return { ...item };
  },
};
