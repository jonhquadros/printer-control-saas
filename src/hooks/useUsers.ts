import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/user.service";
import { UserFormValues } from "../schemas/user.schema";
import { useAuth } from "../contexts/AuthContext";

export function useUsers(companyId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const targetCompanyId = companyId || user?.companyId;

  const usersQuery = useQuery({
    queryKey: ["users", targetCompanyId],
    queryFn: () => {
      if (user?.role === 'SUPER_ADMIN' && !companyId) {
        return userService.getAll();
      }
      if (targetCompanyId) {
        return userService.getByCompany(targetCompanyId);
      }
      return Promise.resolve([]);
    },
    enabled: !!user,
  });

  const createUser = useMutation({
    mutationFn: (data: UserFormValues) => {
      const finalCompanyId = data.companyId || targetCompanyId;
      if (!finalCompanyId) throw new Error("Company ID is required");
      return userService.create(finalCompanyId, data, user?.id, user?.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = useMutation({
    mutationFn: (variables: { id: string; data: Partial<UserFormValues> }) =>
      userService.update(variables.id, variables.data, user?.id, user?.email, targetCompanyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    createUser,
    updateUser,
    deleteUser,
  };
}
