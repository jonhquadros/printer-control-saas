import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceOrderService } from "../services/service-order.service";
import { ServiceOrder, OSStatus } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { ServiceOrderFormValues } from "../schemas/service-order.schema";

export function useServiceOrders() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const companyId = user?.companyId;
  const isTechnician = user?.role === 'TECHNICIAN';

  const query = useQuery({
    queryKey: ["serviceOrders", companyId, user?.id],
    queryFn: () => {
      if (!companyId) return Promise.resolve([]);
      return serviceOrderService.getAll(companyId, isTechnician ? user.id : undefined);
    },
    enabled: !!companyId,
  });

  const createOrder = useMutation({
    mutationFn: (data: ServiceOrderFormValues) => {
      if (!companyId || !user?.id) throw new Error("Missing auth info");
      return serviceOrderService.create(data, companyId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceOrders"] });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: (id: string) => serviceOrderService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceOrders"] });
    },
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    createOrder,
    deleteOrder,
  };
}

export function useServiceOrder(id: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const companyId = user?.companyId;
  
  const query = useQuery({
    queryKey: ["serviceOrder", id],
    queryFn: () => serviceOrderService.getById(id),
    enabled: !!user && !!id,
  });

  const updateStatus = useMutation({
    mutationFn: (status: OSStatus) => {
      if (!companyId || !user?.id) throw new Error("Missing auth");
      return serviceOrderService.updateStatus(id, status, user.id, companyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceOrder", id] });
      queryClient.invalidateQueries({ queryKey: ["serviceOrders"] });
    }
  });
  
  const updateOrder = useMutation({
    mutationFn: (data: Partial<ServiceOrder>) => {
      if (!companyId || !user?.id) throw new Error("Missing auth");
      return serviceOrderService.update(id, data, user.id, companyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceOrder", id] });
      queryClient.invalidateQueries({ queryKey: ["serviceOrders"] });
    }
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    updateStatus,
    updateOrder
  };
}
