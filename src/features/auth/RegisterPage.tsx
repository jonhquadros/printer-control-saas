import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { registerSchema, RegisterFormValues } from "../../schemas/auth.schema";
import { authService } from "../../services/auth.service";
import { Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { reloadProfile } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(data);
      await reloadProfile();
      navigate("/onboarding");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está em uso por outra conta.");
      } else if (err.message?.includes("Identity Toolkit")) {
        setError(err.message);
      } else {
        setError("Erro ao registrar. Verifique os dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <Card className="w-full max-w-lg shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100 shadow-sm">
              <Printer className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-slate-500">
            Cadastre sua empresa no PrinterControl SaaS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-xs font-bold uppercase tracking-widest text-slate-500">Nome da Empresa</Label>
                <Input
                  {...register("companyName")}
                  id="companyName"
                  placeholder="Sua Empresa LTDA"
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                />
                {errors.companyName && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-xs font-bold uppercase tracking-widest text-slate-500">CPF / CNPJ</Label>
                <Input
                  {...register("cnpj")}
                  id="cnpj"
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                />
                {errors.cnpj && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.cnpj.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500">Seu Nome</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="João da Silva"
                className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">E-mail Corporativo</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="joao@empresa.com"
                className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.email.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Senha</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-slate-500">Confirmar Senha</Label>
                <Input
                  {...register("confirmPassword")}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                />
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-4"
              disabled={loading}
            >
              {loading ? "Criando Conta..." : "Criar Conta"}
            </Button>
            
            <div className="mt-6 text-center text-xs text-slate-500">
              Já tem uma conta? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Fazer Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
