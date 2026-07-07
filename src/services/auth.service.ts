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
        action: 'LOGIN',
        userId: result.user.uid,
        userEmail: email,
        status: 'SUCCESS'
      });
      return result;
    } catch (error: any) {
      if (error.message !== "PROFILE_INCOMPLETE") {
        await auditService.log({
          action: 'LOGIN',
          userEmail: email,
          status: 'FAILURE',
          details: error.message
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
        role: email === 'wellingtonprox@gmail.com' ? 'SUPER_ADMIN' : 'ADMIN',
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
        action: 'REGISTER_ONBOARDING',
        userId: user.uid,
        userEmail: email,
        companyId: companyRef.id,
        status: 'SUCCESS'
      });

      return userCredential;
    } catch (error: any) {
       await auditService.log({
        action: 'REGISTER_ONBOARDING',
        userEmail: email,
        status: 'FAILURE',
        details: error.message
      });
      throw error;
    }
  },

  async logout() {
    const user = auth.currentUser;
    if (user) {
      await auditService.log({
        action: 'LOGOUT',
        userId: user.uid,
        userEmail: user.email || '',
        status: 'SUCCESS'
      });
    }
    return firebaseSignOut(auth);
  },

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      await auditService.log({
        action: 'PASSWORD_RESET_REQUEST',
        userEmail: email,
        status: 'SUCCESS'
      });
    } catch (error: any) {
       await auditService.log({
        action: 'PASSWORD_RESET_REQUEST',
        userEmail: email,
        status: 'FAILURE',
        details: error.message
      });
      throw error;
    }
  }
};
