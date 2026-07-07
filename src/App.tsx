/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { ForgotPasswordPage } from "./features/auth/ForgotPasswordPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleGuard } from "./components/auth/RoleGuard";
import { MainLayout } from "./components/layout/MainLayout";

import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CompaniesPage } from "./features/companies/CompaniesPage";
import { UsersPage } from "./features/users/UsersPage";
import { PrintersPage } from "./features/printers/PrintersPage";
import { PrinterDetailPage } from "./features/printers/PrinterDetailPage";
import { ServiceOrdersPage } from "./features/service-orders/ServiceOrdersPage";
import { ServiceOrderDetailPage } from "./features/service-orders/ServiceOrderDetailPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { AdminSetupPage } from "./features/auth/AdminSetupPage";
import { ReportsPage } from "./features/reports/ReportsPage";
import { NewReportPage } from "./features/reports/NewReportPage";
import { WhatsAppPage } from "./features/whatsapp/WhatsAppPage";
import { AIPage } from "./features/ai/AIPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin-setup" element={<AdminSetupPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <MainLayout>
                      <CompaniesPage />
                    </MainLayout>
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                    <MainLayout>
                      <UsersPage />
                    </MainLayout>
                  </RoleGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/printers" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PrintersPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/printers/:id" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PrinterDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service-orders" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ServiceOrdersPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service-orders/:id" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ServiceOrderDetailPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports/new" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <NewReportPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/whatsapp" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <WhatsAppPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AIPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
