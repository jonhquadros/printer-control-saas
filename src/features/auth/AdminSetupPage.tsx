import React from "react";
import { authService } from "../../services/auth.service";
import { Button } from "../../components/ui/button";
import { ShieldCheck, UserPlus, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export const AdminSetupPage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });

  const handleCreateAdmin = async () => {
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      await authService.register({
        email: "wellingtonprox@gmail.com",
        password: "Wjquadros@23",
        confirmPassword: "Wjquadros@23",
        name: "Wellington Admin",
        companyName: "PrinterControl SA",
        cnpj: "00.000.000/0001-00"
      });
      setStatus({ type: 'success', message: "Usuário Super Admin criado com sucesso! Você já pode fazer login." });
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/email-already-in-use" || error.message?.includes("email-already-in-use")) {
        setStatus({ type: 'error', message: "Este usuário já existe no sistema. Tente a opção 'Promover Usuário Existente'." });
      } else {
        setStatus({ type: 'error', message: "Erro ao criar usuário: " + error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteAdmin = async () => {
    setLoading(true);
    setStatus({ type: null, message: "" });
    try {
      // 1. Sign in
      const result = await authService.login({ 
        email: "wellingtonprox@gmail.com", 
        password: "Wjquadros@23" 
      });
      
      const user = result.user;
      
      // 2. Update role in Firestore
      const { db } = await import("../../firebase/config");
      const { doc, updateDoc, setDoc, getDoc, serverTimestamp } = await import("firebase/firestore");
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          role: 'SUPER_ADMIN',
          updatedAt: serverTimestamp()
        });
      } else {
        // If profile doesn't exist for some reason, create it
        await setDoc(userRef, {
          name: "Wellington Admin",
          email: "wellingtonprox@gmail.com",
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      setStatus({ type: 'success', message: "Usuário promovido a SUPER_ADMIN com sucesso!" });
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: "Erro ao promover usuário: " + (error.message === "PROFILE_INCOMPLETE" ? "Perfil incompleto. Tente 'Criar Novo' primeiro." : error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full shadow-xl border-indigo-100">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Setup Inicial Admin</CardTitle>
          <p className="text-sm text-slate-500">
            Gerencie o usuário administrador mestre do sistema.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-[11px] text-amber-800 leading-tight">
              <strong>Atenção:</strong> Esta ferramenta é para uso administrativo único. 
              Após a criação ou promoção, remova esta rota por segurança.
            </div>
          </div>

          <div className="space-y-2 text-sm border border-slate-100 p-3 rounded-lg bg-slate-50/50">
            <p><strong>Email:</strong> wellingtonprox@gmail.com</p>
            <p><strong>Senha:</strong> Wjquadros@23</p>
            <p><strong>Role:</strong> SUPER_ADMIN</p>
          </div>

          <div className="grid gap-3">
            <Button 
              onClick={handleCreateAdmin} 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 font-bold"
            >
              {loading ? "Processando..." : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Criar Novo Super Admin
                </span>
              )}
            </Button>

            <Button 
              onClick={handlePromoteAdmin} 
              disabled={loading}
              variant="outline"
              className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 py-4 font-bold"
            >
              {loading ? "Processando..." : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Promover Usuário Existente
                </span>
              )}
            </Button>
          </div>

          {status.type && (
            <div className={`p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {status.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
