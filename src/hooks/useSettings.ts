import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, notificationService } from '../services/settings.service';
import { InAppNotification } from '../types/settings';

export function useSettings(companyId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['settings', companyId],
    queryFn: () => companyId ? settingsService.getSettings(companyId) : null,
    enabled: !!companyId,
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (!companyId) throw new Error("Company ID required");
      return settingsService.updateSettings(companyId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', companyId] });
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}

export function useInAppNotifications(companyId?: string, userId?: string) {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId || !userId) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = notificationService.subscribe(companyId, userId, (data) => {
      setNotifications(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [companyId, userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: notificationService.markAsRead,
    markAllAsRead: () => userId && companyId && notificationService.markAllAsRead(userId, companyId),
  };
}
