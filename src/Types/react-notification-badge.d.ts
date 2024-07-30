// src/types/react-notification-badge.d.ts
declare module 'react-notification-badge' {
    import { ComponentType, CSSProperties } from 'react';
  
    export interface NotificationBadgeProps {
      count: number;
      className?: string;
      style?: CSSProperties;
      effect?: string;
    }
  
    const NotificationBadge: ComponentType<NotificationBadgeProps>;
    export default NotificationBadge;
  }
  