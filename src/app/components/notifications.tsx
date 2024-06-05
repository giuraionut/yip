import { NotificationInstance, NotificationPlacement } from 'antd/es/notification/interface';
import React from 'react'
export const dayChangeNotification = (
    placement: NotificationPlacement,
    description: React.ReactNode,
    message: string,
    api: NotificationInstance
) => {
    api.info({
        message: message,
        description: description,
        placement,
    });
};