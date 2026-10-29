import { Contributor, EventPlan } from '../types';

const CHANNEL_NAME = 'celeste_atelier_sync_channel';

export interface CollaborationMessage {
  type: 'EVENT_UPDATE' | 'NEW_NOTE' | 'TASK_STATUS' | 'CONTRIBUTOR_PING';
  eventId: string;
  contributorName: string;
  summary: string;
  timestamp: string;
  updatedPlan?: EventPlan;
}

class CollaborationService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((msg: CollaborationMessage) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not available in this environment', e);
      }
    }
  }

  public broadcast(msg: CollaborationMessage) {
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {
        console.warn('Failed to broadcast collaboration message', e);
      }
    }
  }

  public subscribe(callback: (msg: CollaborationMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners(msg: CollaborationMessage) {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch (e) {
        console.error('Error in collaboration listener', e);
      }
    });
  }
}

export const collabService = new CollaborationService();
