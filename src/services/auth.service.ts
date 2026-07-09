import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { LoginFormValues, RegisterFormValues } from "../schemas/auth.schema";
import { auditService } from "./audit.service";
import { Company, User } from "../types";

export const authService = {
  async login({ email, password }: LoginFormValues) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Verify if the user profile exists in Firestore
      const { userService } = await import("./user.service");
      const profile = await userService.getProfile(result.user.uid);
      
      if (!profile) {
        // Registration was interrupted, clean up the auth user so they can try again
        await result.user.delete();
        throw new Error("PROFILE_INCOMPLETE");
      }
      
      await auditService.log({
        module: 'AUTH',
        action: 'LOGIN',
        userId: result.user.uid,
        userEmail: email,
        userName: profile.name,
        companyId: profile.companyId,
        details: `Usuário ${email} realizou login com sucesso.`
      });
      return result;
    } catch (error: any) {
      if (error.message !== "PROFILE_INCOMPLETE") {
        await auditService.log({
          module: 'AUTH',
          action: 'LOGIN',
          userEmail: email,
          details: `Falha no login: ${error.message}`
        });
      }
      throw error;
    }
  },

  async register({ email, password, name, companyName, cnpj }: RegisterFormValues) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create company document first
      const companyRef = doc(collection(db, "companies"));
      const newCompany: Omit<Company, 'id'> = {
        name: companyName,
        cnpj,
        email,
        phone: '',
        address: '',
        city: '',
        state: '',
        plan: 'STARTER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(companyRef, {
        ...newCompany,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create user profile document
      const userProfile: Omit<User, 'id'> = {
        name,
        email,
        role: (email === 'wellingtonprox@gmail.com' || email === 'jonhquadros@gmail.com') ? 'SUPER_ADMIN' : 'ADMIN',
        companyId: companyRef.id,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date()
      };

      await setDoc(doc(db, "users", user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      await auditService.log({
        module: 'AUTH',
        action: 'CREATE',
        userId: user.uid,
        userEmail: email,
        userName: name,
        companyId: companyRef.id,
        details: `Novo usuário ${email} registrado via formulário de cadastro.`
      });

      return userCredential;
    } catch (error: any) {
       let errorMessage = error.message;
       if (error.message?.includes("identitytoolkit.googleapis.com")) {
         errorMessage = "O serviço de Autenticação não está totalmente configurado. Acesse o Console do Firebase, clique em 'Authentication' -> 'Get Started' e habilite o provedor 'E-mail/Senha'.";
       }

       await auditService.log({
        module: 'AUTH',
        action: 'CREATE',
        userEmail: email,
        details: `Falha no registro de usuário ${email}: ${errorMessage}`
      });
      throw new Error(errorMessage);
    }
  },

  async logout() {
    const user = auth.currentUser;
    if (user) {
      await auditService.log({
        module: 'AUTH',
        action: 'LOGOUT',
        userId: user.uid,
        userEmail: user.email || '',
        details: `Usuário encerrou a sessão.`
      });
    }
    return firebaseSignOut(auth);
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      await auditService.log({
        module: 'AUTH',
        action: 'UPDATE',
        userEmail: email,
        details: `Solicitação de redefinição de senha para ${email}.`
      });
    } catch (error: any) {
       await auditService.log({
        module: 'AUTH',
        action: 'UPDATE',
        userEmail: email,
        details: `Falha ao solicitar redefinição de senha para ${email}: ${error.message}`
      });
      throw error;
    }
  }
};
