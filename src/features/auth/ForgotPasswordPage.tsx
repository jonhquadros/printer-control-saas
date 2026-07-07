import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { resetPasswordSchema, ResetPasswordFormValues } from "../../schemas/auth.schema";
import { authService } from "../../services/auth.service";
import { Printer } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export const ForgotPasswordPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await authService.resetPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao enviar e-mail de recuperação. Verifique o endereço e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100 shadow-sm">
              <Printer className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Recuperar Senha
          </CardTitle>
          <CardDescription className="text-slate-500">
            Enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100 font-medium animate-in slide-in-from-top-2">
                E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.
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
            
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] mt-2"
              disabled={loading || success}
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>
            
            <div className="mt-6 text-center text-xs text-slate-500">
              Lembrou sua senha? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Voltar para Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
