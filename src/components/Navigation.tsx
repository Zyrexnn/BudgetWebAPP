'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, TrendingUp, Wallet, Heart, X } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

export default function Navigation({ activeTab, onTabChange, mobileOnly, desktopOnly }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transaksi', icon: Wallet },
    { id: 'reports', label: 'Laporan', icon: TrendingUp },
    { id: 'assistant', label: 'Wife Finance', icon: Heart },
  ];

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false); // Close mobile menu after selection
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex ${mobile ? 'flex-col' : 'flex-col'} space-y-2`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Button
            key={tab.id}
            variant={isActive ? 'default' : 'ghost'}
            className={`
              justify-start h-12 transition-all duration-300 btn-animate relative overflow-hidden group
              ${isActive 
                ? `bg-gradient-to-r ${
                    tab.id === 'dashboard' ? 'from-blue-600 via-purple-600 to-blue-600' :
                    tab.id === 'transactions' ? 'from-purple-600 via-pink-600 to-purple-600' :
                    tab.id === 'reports' ? 'from-green-600 via-emerald-600 to-green-600' :
                    'from-pink-600 via-rose-600 to-pink-600'
                  } text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 bg-size-200 animate-gradient shadow-lg transform scale-105` 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 hover:translate-x-1'
              }
              ${mobile ? 'text-base' : ''}
            `}
            onClick={() => handleTabChange(tab.id)}
          >
            <Icon className={`mr-3 h-5 w-5 transition-all duration-200 group-hover:scale-110 ${
              isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'
            }`} />
            <span className={`font-medium transition-all duration-200 ${
              isActive ? 'text-white' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute inset-0 bg-white/10 animate-pulse-slow rounded-lg"></div>
            )}
            {!isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            )}
          </Button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      {!desktopOnly && (
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 btn-animate shadow-sm"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[280px] sm:w-[320px] bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 border-r border-slate-200 dark:border-slate-700 p-0"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div>
                    <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                      BudgetWebAPP
                    </SheetTitle>
                    <SheetDescription className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Kelola keuangan pribadi Anda
                    </SheetDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 btn-animate"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <NavItems mobile />
                </nav>
                
                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    © 2024 BudgetWebAPP
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop Navigation */}
      {!mobileOnly && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-gradient-to-b md:from-white/95 md:to-white/90 dark:md:from-slate-900/95 dark:md:to-slate-900/90 md:border-r md:border-slate-200 dark:md:border-slate-700 backdrop-blur supports-[backdrop-filter]:md:from-white/80 dark:supports-[backdrop-filter]:md:from-slate-900/80">
          <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-md"></div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  BudgetWebAPP
                </h1>
              </div>
            </div>
            <nav className="mt-2 flex-1 px-3 space-y-1">
              <NavItems />
            </nav>
            <div className="px-3 py-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center px-3 py-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                © 2024 BudgetWebAPP
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}