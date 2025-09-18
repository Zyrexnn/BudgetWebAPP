'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/dashboard/Dashboard';
import TransactionList from '@/components/transactions/TransactionList';
import Reports from '@/components/reports/Reports';
import WifeFinanceAssistant from '@/components/ai/WifeFinanceAssistant';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'reports':
        return <Reports />;
      case 'assistant':
        return <WifeFinanceAssistant />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 shadow-sm">
        <div className="flex items-center gap-3">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} mobileOnly />
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              BudgetWebAPP
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'transactions' && 'Manajemen Transaksi'}
              {activeTab === 'reports' && 'Laporan Keuangan'}
              {activeTab === 'assistant' && 'Wife Finance Assistant'}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} desktopOnly />

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-6 lg:p-8 pt-6 max-w-7xl mx-auto">
          {/* Page Header for Desktop */}
          <div className="hidden md:block mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-12 w-1 rounded-full bg-gradient-to-b ${
                activeTab === 'dashboard' ? 'from-blue-500 to-purple-600' :
                activeTab === 'transactions' ? 'from-purple-500 to-pink-600' :
                activeTab === 'reports' ? 'from-green-500 to-emerald-600' :
                'from-pink-500 to-rose-600'
              }`}></div>
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${
                  activeTab === 'dashboard' ? 'from-blue-600 via-purple-600 to-blue-600' :
                  activeTab === 'transactions' ? 'from-purple-600 via-pink-600 to-purple-600' :
                  activeTab === 'reports' ? 'from-green-600 via-emerald-600 to-green-600' :
                  'from-pink-600 via-rose-600 to-pink-600'
                } bg-clip-text text-transparent bg-size-200 animate-gradient`}>
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'transactions' && 'Manajemen Transaksi'}
                  {activeTab === 'reports' && 'Laporan Keuangan'}
                  {activeTab === 'assistant' && 'Wife Finance Assistant'}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                  {activeTab === 'dashboard' && 'Ringkasan keuangan Anda'}
                  {activeTab === 'transactions' && 'Kelola semua transaksi keuangan Anda'}
                  {activeTab === 'reports' && 'Analisis dan laporan keuangan'}
                  {activeTab === 'assistant' && 'Asisten keuangan pribadi yang cerdas dan peduli'}
                </p>
              </div>
            </div>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
}