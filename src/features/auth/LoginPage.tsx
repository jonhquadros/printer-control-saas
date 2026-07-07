import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema, LoginFormValues } from "../../schemas/auth.schema";
import { authService } from "../../services/auth.service";
import { Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { reloadProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(data);
      await reloadProfile();
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.message === "PROFILE_INCOMPLETE") {
        setError("Seu cadastro não foi concluído corretamente. Por favor, crie a conta novamente.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("E-mail ou senha incorretos.");
      } else {
        setError("Erro ao autenticar. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100 shadow-sm">
              <Printer className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            PrinterControl SaaS
          </CardTitle>
          <CardDescription className="text-slate-500">
            Entre na sua conta para gerenciar seus equipamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500">E-mail</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="exemplo@empresa.com"
                className="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">Senha</Label>
                <Link to="/forgot-password" className="text-[10px] text-indigo-600 hover:underline font-bold uppercase tracking-widest">
                  Esqueceu?
                </Link>
              </div>
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

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-2"
              disabled={loading}
            >
              {loading ? "Autenticando..." : "Entrar no Sistema"}
            </Button>
            
            <div className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              &copy; 2026 PrinterControl SaaS
            </div>
            
            <div className="mt-4 text-center text-xs text-slate-500">
              Não tem uma conta? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Criar agora</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
