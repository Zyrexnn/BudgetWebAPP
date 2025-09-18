'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBudgetStore } from '@/store/budgetStore';
import { Transaction } from '@/types';
import TransactionForm from './TransactionForm';
import { Search, Filter, Plus, Edit3, Trash2, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export default function TransactionList() {
  const { transactions, categories, deleteTransaction } = useBudgetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.category.id === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setTransactionToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleAddNew = () => {
    setSelectedTransaction(undefined);
    setIsFormOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Manajemen Transaksi
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
              Kelola semua transaksi keuangan Anda dengan mudah dan efisien
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Add Button */}
      <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md transition-all duration-300 group-hover:scale-110">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold">Filter Transaksi</span>
              <p className="text-sm text-muted-foreground font-normal">
                Cari dan filter transaksi berdasarkan kategori, tipe, atau deskripsi
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium flex items-center gap-2">
                <Search className="h-4 w-4" />
                Cari
              </Label>
              <Input
                id="search"
                placeholder="Cari deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Kategori</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Tipe</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="income" className="flex items-center gap-2">
                    <span className="text-green-600">📈</span>
                    <span>Pemasukan</span>
                  </SelectItem>
                  <SelectItem value="expense" className="flex items-center gap-2">
                    <span className="text-red-600">📉</span>
                    <span>Pengeluaran</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label> </Label>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddNew} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 btn-animate shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah
                </Button>
                {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 btn-animate hover:scale-105"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pemasukan</p>
                <p className="text-xl font-bold text-green-600 transition-all duration-300 group-hover:scale-105">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'income')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 shadow-sm transition-all duration-300 group-hover:scale-110">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                <p className="text-xl font-bold text-red-600 transition-all duration-300 group-hover:scale-105">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 shadow-sm transition-all duration-300 group-hover:scale-110">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 card-hover group transition-all duration-300 hover:scale-105">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="text-xl font-bold text-blue-600 transition-all duration-300 group-hover:scale-105">
                  {filteredTransactions.length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-md transition-all duration-300 group-hover:scale-110">
                {filteredTransactions.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Table */}
      <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg card-hover group">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md transition-all duration-300 group-hover:scale-110">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold">Daftar Transaksi</span>
              <p className="text-sm text-muted-foreground font-normal">
                Menampilkan {filteredTransactions.length} transaksi
                {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
                  <Badge variant="secondary" className="ml-2 animate-pulse">
                    Filter aktif
                  </Badge>
                )}
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
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Tanggal</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Deskripsi</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kategori</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Tipe</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Jumlah</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id} 
                      className="transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:scale-[1.01] group"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          {formatDate(transaction.date)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg transition-all duration-200 group-hover:scale-110">{transaction.category.icon}</span>
                          <div className="flex items-center gap-1">
                            <span>{transaction.category.name}</span>
                            <div 
                              className="w-2 h-2 rounded-full transition-all duration-200 group-hover:scale-150" 
                              style={{ backgroundColor: transaction.category.color }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.type === 'income' ? 'default' : 'destructive'}
                          className="flex items-center gap-1 btn-animate transition-all duration-200 group-hover:scale-105"
                        >
                          {transaction.type === 'income' ? (
                            <>
                              <TrendingUp className="h-3 w-3" />
                              Pemasukan
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3" />
                              Pengeluaran
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="flex items-center justify-end gap-1 transition-all duration-200 group-hover:scale-105">
                          {transaction.type === 'income' ? '+' : '-'}
                          <span className="font-bold">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:scale-105 btn-animate"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            className="transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:scale-105 btn-animate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Tidak ada transaksi yang ditemukan</p>
                    <p className="text-sm mt-1">Coba ubah filter atau tambahkan transaksi baru</p>
                  </div>
                  <Button onClick={handleAddNew} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 btn-animate hover:scale-105 transition-all duration-200">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Transaksi
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Form Dialog */}
      <TransactionForm
        transaction={selectedTransaction}
        onClose={() => setIsFormOpen(false)}
        isOpen={isFormOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200 dark:border-slate-700 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md transition-all duration-300 hover:scale-110">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Konfirmasi Hapus</span>
            </DialogTitle>
            <DialogDescription className="text-base">
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={cancelDelete}
              className="transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 btn-animate hover:scale-105"
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 transition-all duration-200 btn-animate hover:scale-105 shadow-md"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}