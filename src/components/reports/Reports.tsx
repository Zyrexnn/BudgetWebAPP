'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useBudgetStore } from '@/store/budgetStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Award, PieChart, Sparkles } from 'lucide-react';

export default function Reports() {
  const { getMonthlySpending, getCategorySpending } = useBudgetStore();
  const monthlySpending = getMonthlySpending();
  const categorySpending = getCategorySpending().filter(item => item.totalAmount > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
    });
  };

  const totalExpense = categorySpending.reduce((sum, item) => sum + item.totalAmount, 0);
  const averageSpending = monthlySpending.length > 0 
    ? monthlySpending.reduce((sum, item) => sum + item.amount, 0) / monthlySpending.length 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Laporan Keuangan
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Analisis tren dan ringkasan pengeluaran Anda untuk wawasan keuangan yang lebih baik
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-105">
                  {formatCurrency(totalExpense)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 shadow-sm transition-all duration-300 group-hover:scale-110">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rata-rata/Bulan</p>
                <p className="text-2xl font-bold text-green-600 transition-all duration-300 group-hover:scale-105">
                  {formatCurrency(averageSpending)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 shadow-sm transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kategori Aktif</p>
                <p className="text-2xl font-bold text-purple-600 transition-all duration-300 group-hover:scale-105">
                  {categorySpending.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 shadow-sm transition-all duration-300 group-hover:scale-110">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bulan Aktif</p>
                <p className="text-2xl font-bold text-orange-600 transition-all duration-300 group-hover:scale-105">
                  {monthlySpending.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 shadow-sm transition-all duration-300 group-hover:scale-110">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Monthly Trend Chart */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Tren Pengeluaran Bulanan</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Grafik perkembangan pengeluaran Anda dari waktu ke waktu
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlySpending} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatMonth}
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
                  formatter={(value: number) => [formatCurrency(value), 'Pengeluaran']}
                  labelFormatter={(label) => `Bulan: ${formatMonth(label)}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#3b82f6' }}
                  className="drop-shadow-sm transition-all duration-300 hover:opacity-80"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Comparison Chart */}
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Perbandingan Kategori</span>
                <p className="text-sm text-muted-foreground font-normal">
                  5 kategori dengan pengeluaran tertinggi
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart 
                data={categorySpending.slice(0, 5)} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}jt`}
                  tickLine={false}
                />
                <YAxis 
                  type="category"
                  dataKey="category.name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  width={80}
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
                  fill="url(#barGradient)" 
                  radius={[0, 6, 6, 0]}
                  className="drop-shadow-sm transition-all duration-300 hover:opacity-80"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Spending Summary */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <TrendingDown className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Ringkasan Pengeluaran per Kategori</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Total pengeluaran berdasarkan kategori, diurutkan dari terbesar
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {categorySpending
                .sort((a, b) => b.totalAmount - a.totalAmount)
                .map((item, index) => (
                  <div 
                    key={item.category.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-md transition-all duration-300 group-hover:scale-110">
                        <span className="text-xl">{item.category.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {item.category.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.percentage.toFixed(1)}% dari total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-slate-100 transition-all duration-300 group-hover:scale-105">
                        {formatCurrency(item.totalAmount)}
                      </p>
                      <Badge 
                        variant={index === 0 ? 'default' : index === 1 ? 'secondary' : 'outline'}
                        className="mt-2 text-xs font-medium transition-all duration-300 group-hover:scale-105"
                      >
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Statistik Pengeluaran</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Informasi statistik tentang pola pengeluaran Anda
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 border border-blue-200 dark:border-blue-800 card-hover group transition-all duration-300 hover:scale-105">
                  <p className="text-3xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-110">
                    {categorySpending.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Kategori Aktif</p>
                  <div className="w-12 h-1 bg-blue-200 dark:bg-blue-800 rounded-full mx-auto mt-3 transition-all duration-300 group-hover:scale-110"></div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 border border-green-200 dark:border-green-800 card-hover group transition-all duration-300 hover:scale-105">
                  <p className="text-3xl font-bold text-green-600 transition-all duration-300 group-hover:scale-110">
                    {monthlySpending.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Bulan Aktif</p>
                  <div className="w-12 h-1 bg-green-200 dark:bg-green-800 rounded-full mx-auto mt-3 transition-all duration-300 group-hover:scale-110"></div>
                </div>
              </div>
              
              {categorySpending.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                    Kategori Terbesar
                  </h4>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 group transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-all duration-300 group-hover:scale-110">{categorySpending[0].category.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {categorySpending[0].category.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {categorySpending[0].percentage.toFixed(1)}% dari total
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-orange-600 transition-all duration-300 group-hover:scale-105">
                      {formatCurrency(categorySpending[0].totalAmount)}
                    </span>
                  </div>
                </div>
              )}
              
              {monthlySpending.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Rata-rata Pengeluaran Bulanan
                  </h4>
                  <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 border border-purple-200 dark:border-purple-800 card-hover group transition-all duration-300 hover:scale-105">
                    <p className="text-3xl font-bold text-purple-600 transition-all duration-300 group-hover:scale-110">
                      {formatCurrency(averageSpending)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Rata-rata per bulan</p>
                    <div className="w-12 h-1 bg-purple-200 dark:bg-purple-800 rounded-full mx-auto mt-3 transition-all duration-300 group-hover:scale-110"></div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category Table */}
      {categorySpending.length > 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md transition-all duration-300 group-hover:scale-110">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">Detail Kategori</span>
                <p className="text-sm text-muted-foreground font-normal">
                  Tabel lengkap pengeluaran per kategori dengan persentase
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kategori</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Jumlah</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Persentase</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Peringkat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySpending
                      .sort((a, b) => b.totalAmount - a.totalAmount)
                      .map((item, index) => (
                        <TableRow 
                          key={item.category.id} 
                          className="transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <span className="text-xl transition-all duration-200 group-hover:scale-110">{item.category.icon}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                  {item.category.name}
                                </span>
                                <div 
                                  className="w-3 h-3 rounded-full transition-all duration-200 group-hover:scale-150" 
                                  style={{ backgroundColor: item.category.color }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                            {formatCurrency(item.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 hover:opacity-80"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[45px]">
                                {item.percentage.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={index === 0 ? 'default' : index === 1 ? 'secondary' : index === 2 ? 'outline' : 'secondary'}
                              className="flex items-center gap-1 btn-animate transition-all duration-200 group-hover:scale-105"
                            >
                              {index === 0 && <Award className="h-3 w-3" />}
                              #{index + 1}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {categorySpending.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
          <CardContent className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse transition-all duration-300 group-hover:scale-110">
                <PieChart className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="text-lg font-medium">Belum ada data pengeluaran</p>
                <p className="text-sm mt-1 text-muted-foreground">Mulai tambahkan transaksi untuk melihat laporan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}