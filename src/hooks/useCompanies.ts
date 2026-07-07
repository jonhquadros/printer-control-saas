import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "../services/company.service";
import { CompanyFormValues } from "../schemas/company.schema";
import { useAuth } from "../contexts/AuthContext";

export function useCompanies() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: () => companyService.getAll(),
    enabled: !!user && user.role === 'SUPER_ADMIN',
  });

  const myCompanyQuery = useQuery({
    queryKey: ["companies", user?.companyId],
    queryFn: () => user?.companyId ? companyService.getById(user.companyId) : null,
    enabled: !!user && !!user.companyId,
  });

  const createCompany = useMutation({
    mutationFn: (variables: { data: CompanyFormValues; logoFile?: File }) =>
      companyService.create(variables.data, variables.logoFile, user?.id, user?.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  const updateCompany = useMutation({
    mutationFn: (variables: { id: string; data: Partial<CompanyFormValues>; logoFile?: File }) =>
      companyService.update(variables.id, variables.data, variables.logoFile, user?.id, user?.email),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["companies", variables.id] });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });

  return {
    companies: companiesQuery.data || [],
    myCompany: myCompanyQuery.data,
    isLoading: companiesQuery.isLoading || myCompanyQuery.isLoading,
    createCompany,
    updateCompany,
    deleteCompany,
  };
}
