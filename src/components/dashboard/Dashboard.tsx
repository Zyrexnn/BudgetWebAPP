'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBudgetStore } from '@/store/budgetStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { getBudgetSummary, getCategorySpending, getHighestTransaction } = useBudgetStore();
  const summary = getBudgetSummary();
  const categorySpending = getCategorySpending().filter(item => item.totalAmount > 0);
  const highestTransaction = getHighestTransaction();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryCards = [
    {
      title: 'Total Pemasukan',
      amount: summary.totalIncome,
      description: 'Total pendapatan bulan ini',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Total Pengeluaran',
      amount: summary.totalExpense,
      description: 'Total pengeluaran bulan ini',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconBg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: 'Saldo',
      amount: summary.balance,
      description: 'Sisa anggaran bulan ini',
      icon: Wallet,
      color: summary.balance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: summary.balance >= 0 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20' 
        : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20',
      borderColor: summary.balance >= 0 ? 'border-blue-200 dark:border-blue-800' : 'border-red-200 dark:border-red-800',
      iconBg: summary.balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Ringkasan keuangan pribadi Anda dalam satu pandangan yang jelas dan informatif
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.title} 
              className={`
                transition-all duration-300 card-hover border-2 ${card.borderColor} ${card.bgColor}
                shadow-lg hover:shadow-xl relative overflow-hidden group
                hover:scale-105 hover:-translate-y-1
              `}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform rotate-45 scale-150"></div>
              </div>
              
              {/* Animated border effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${card.iconBg} shadow-sm transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-3xl font-bold ${card.color} mb-2 transition-all duration-300 group-hover:scale-105`}>
                  {formatCurrency(card.amount)}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {card.description}
                </p>
                {card.title === 'Saldo' && (
                  <Badge 
                    variant={card.amount >= 0 ? 'default' : 'destructive'} 
                    className={`
                      text-xs font-medium shadow-sm transition-all duration-300
                      ${card.amount >= 0 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                      }
                    `}
                  >
                    {card.amount >= 0 ? '✨ Sehat' : '⚠️ Perhatian'}
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Bar Chart - Category Spending */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Pengeluaran per Kategori</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Perbandingan pengeluaran berdasarkan kategori
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={categorySpending} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="category.name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}jt`}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Jumlah']}
                  labelFormatter={(label) => `Kategori: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar 
                  dataKey="totalAmount" 
                  fill="url(#colorGradient)" 
                  radius={[6, 6, 0, 0]}
                  className="drop-shadow-sm transition-all duration-300 hover:opacity-80"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Spending Distribution */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Distribusi Pengeluaran</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Persentase alokasi pengeluaran dari total anggaran
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category.name} ${percentage.toFixed(1)}%`}
                  outerRadius={120}
                  innerRadius={70}
                  fill="#8884d8"
                  dataKey="totalAmount"
                  paddingAngle={3}
                  className="drop-shadow-sm transition-all duration-300 hover:scale-105"
                >
                  {categorySpending.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={3}
                      className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Jumlah']}
                  labelFormatter={(label) => `Kategori: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      {categorySpending.length > 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Statistik Cepat</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Informasi penting tentang pengeluaran Anda
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 border border-blue-200 dark:border-blue-800 card-hover group transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-blue-600 mb-2 transition-all duration-300 group-hover:scale-110">
                  {categorySpending.length}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Kategori Aktif</div>
                <div className="w-12 h-1 bg-blue-200 dark:bg-blue-800 rounded-full mx-auto mt-3 transition-all duration-300 group-hover:scale-110"></div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 border border-green-200 dark:border-green-800 card-hover group transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold text-green-600 mb-2 transition-all duration-300 group-hover:scale-110">
                  {categorySpending[0].category.name}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Kategori Terbesar</div>
                <div className="w-12 h-1 bg-green-200 dark:bg-green-800 rounded-full mx-auto mt-3 transition-all duration-300 group-hover:scale-110"></div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 border border-purple-200 dark:border-purple-800 card-hover group transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold text-purple-600 mb-2 transition-all duration-300 group-hover:scale-110">
                  {highestTransaction ? formatCurrency(highestTransaction.amount) : formatCurrency(0)}
                </div>
                <div className="text-sm text-muted-foreground font-medium">Pengeluaran Tertinggi</div>
                {highestTransaction && (
                  <div className="text-xs text-purple-500 mt-1 font-medium">
                    {highestTransaction.description}
                  </div>
                )}
                <div className="w-12 h-1 bg-purple-200 dark:bg-purple-800 rounded-full mx-auto mt-3 transition-all duration-300 group-hover:scale-110"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}