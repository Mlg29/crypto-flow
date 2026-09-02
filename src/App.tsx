import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./lib/AppContext";
import { ToastHost } from "./components/ToastHost";
import { ChatWidget } from "./components/ChatWidget";

import { PublicLayout } from "./layouts/PublicLayout";
import { AppLayout } from "./layouts/AppLayout";

import { ExchangeLanding } from "./pages/public/ExchangeLanding";
import { OrderWizard } from "./pages/public/OrderWizard";
import { DepositStatus } from "./pages/public/DepositStatus";
import { RecoveryLookup } from "./pages/public/RecoveryLookup";
import { InvoicePay } from "./pages/public/InvoicePay";

import { SignUp } from "./pages/onboarding/SignUp";
import { VerifyEmail } from "./pages/onboarding/VerifyEmail";
import { BusinessVerification } from "./pages/onboarding/BusinessVerification";
import { VerificationStatus } from "./pages/onboarding/VerificationStatus";

import { DashboardHome } from "./pages/dashboard/DashboardHome";
import { WalletDetail } from "./pages/dashboard/WalletDetail";
import { Invoices } from "./pages/dashboard/Invoices";
import { CreateInvoice } from "./pages/dashboard/CreateInvoice";
import { InvoiceDetail } from "./pages/dashboard/InvoiceDetail";
import { Payouts } from "./pages/dashboard/Payouts";
import { Developers } from "./pages/dashboard/Developers";
import { Analytics } from "./pages/dashboard/Analytics";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<ExchangeLanding />} />
            <Route path="/order/new" element={<OrderWizard />} />
            <Route path="/order/lookup" element={<RecoveryLookup />} />
            <Route path="/order/:claimCode" element={<DepositStatus />} />
          </Route>

          <Route path="/pay/:invoiceId" element={<InvoicePay />} />

          <Route path="/onboarding/signup" element={<SignUp />} />
          <Route path="/onboarding/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding/verify" element={<BusinessVerification />} />
          <Route path="/onboarding/verification" element={<VerificationStatus />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/wallets/:chainId" element={<WalletDetail />} />
            <Route path="/dashboard/invoices" element={<Invoices />} />
            <Route path="/dashboard/invoices/new" element={<CreateInvoice />} />
            <Route path="/dashboard/invoices/:invoiceId" element={<InvoiceDetail />} />
            <Route path="/dashboard/payouts" element={<Payouts />} />
            <Route path="/dashboard/developers" element={<Developers />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
          </Route>
        </Routes>
        <ToastHost />
        <ChatWidget />
      </BrowserRouter>
    </AppProvider>
  );
}
