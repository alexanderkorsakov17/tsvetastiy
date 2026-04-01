
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Edit3, 
  Trash2, 
  Plus, 
  X, 
  Check, 
  ChevronRight, 
  LayoutDashboard, 
  ShoppingBag, 
  ArrowLeft,
  User as UserIcon,
  Search,
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  Clock,
  Copy,
  Lock,
  LogIn,
  LogOut,
  History as HistoryIcon,
  TrendingDown,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { Product, Category, User as AppUser, BonusTransaction } from './types';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'created' | 'shipped' | 'delivered' | 'received';
  items: string[];
  userId: string;
  userName?: string;
  userContact?: string;
  deliveryAddress?: string;
  deliveryProvider?: string;
}

const ORDER_STATUSES = [
  { id: 'created', label: 'Принят', color: 'bg-blue-500' },
  { id: 'shipped', label: 'В пути', color: 'bg-amber-500' },
  { id: 'delivered', label: 'В ПВЗ', color: 'bg-green-500' },
  { id: 'received', label: 'Дома', color: 'bg-gray-400' },
];


export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  
  // User detail view
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [userHistory, setUserHistory] = useState<BonusTransaction[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [deductAmount, setDeductAmount] = useState('');
  const [deductDescription, setDeductDescription] = useState('');
  const [isDeducting, setIsDeducting] = useState(false);
  
  // Password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Korsakov7984') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      fetchData();
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.error || 'Upload failed');
        }

        const data = await response.json();
        setEditingProduct(prev => ({ ...prev, image: data.url }));
        console.log("Image uploaded successfully to S3:", data.url);
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert("Ошибка при загрузке изображения на сервер.\n\nДетали: " + error.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/users')
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const userData = await userRes.json();
      setProducts(prodData);
      setOrders(orderData);
      setUsers(userData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserHistory = async (userId: string) => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/history`);
      const data = await res.json();
      setUserHistory(data);
    } catch (error) {
      console.error('Failed to fetch user history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleDeductBonuses = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !deductAmount) return;
    
    setIsDeducting(true);
    try {
      const amount = -Math.abs(Number(deductAmount));
      const res = await fetch(`/api/admin/users/${selectedUser.id}/bonuses`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description: deductDescription })
      });
      
      if (res.ok) {
        const { user, transaction } = await res.json();
        setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        setSelectedUser(user);
        setUserHistory(prev => [transaction, ...prev]);
        setDeductAmount('');
        setDeductDescription('');
      }
    } catch (error) {
      console.error('Failed to deduct bonuses:', error);
    } finally {
      setIsDeducting(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const renderOrders = () => {
    const filteredOrders = orders.filter(o => 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.deliveryAddress?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.userId.toLowerCase().includes(orderSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Отслеживание заказов</h2>
          <div className="relative w-full sm:w-64">
            <input 
              type="text"
              placeholder="Поиск по ID или адресу..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Заказ</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Доставка</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Товары</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Сумма</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Статус</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col group">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-gray-900">#{order.id}</span>
                          <button 
                            onClick={() => copyToClipboard(order.id, `id-${order.id}`)}
                            className={`p-1 rounded-md transition-all ${copySuccess === `id-${order.id}` ? 'text-green-500' : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-blue-500'}`}
                          >
                            {copySuccess === `id-${order.id}` ? <Check size={10} /> : <Copy size={10} />}
                          </button>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 group">
                        <div className="flex items-center gap-2">
                          <UserIcon size={12} className="text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-tight text-gray-900">{order.userName || 'Гость'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-500 lowercase">{order.userContact || 'Нет контактов'}</span>
                          {order.userContact && (
                            <button 
                              onClick={() => copyToClipboard(order.userContact!, `contact-${order.id}`)}
                              className={`p-1 rounded-md transition-all ${copySuccess === `contact-${order.id}` ? 'text-green-500' : 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-blue-500'}`}
                            >
                              {copySuccess === `contact-${order.id}` ? <Check size={10} /> : <Copy size={10} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Truck size={12} className="text-blue-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{order.deliveryProvider || 'Самовывоз'}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 leading-tight max-w-[200px]">{order.deliveryAddress || 'Не указан'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, i) => (
                          <span key={i} className="text-[10px] font-bold text-gray-700">{item}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-blue-600">{order.total}₽</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${ORDER_STATUSES.find(s => s.id === order.status)?.color}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                          {ORDER_STATUSES.find(s => s.id === order.status)?.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="bg-gray-100 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status.id} value={status.id}>{status.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <ShoppingBag size={32} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Заказов не найдено</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const filteredUsers = users.filter(user => 
      user.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.tgId.toLowerCase().includes(userSearch.toLowerCase())
    );

    const getInvitedUsers = (userId: string, level: number) => {
      const l1 = users.filter(u => u.invitedBy === userId);
      if (level === 1) return l1;
      
      const l2 = users.filter(u => l1.some(l1u => u.invitedBy === l1u.id));
      if (level === 2) return l2;
      
      const l3 = users.filter(u => l2.some(l2u => u.invitedBy === l2u.id));
      if (level === 3) return l3;
      
      return [];
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Управление пользователями</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text"
              placeholder="Поиск по имени, email или TG..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Пользователь</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Контакты</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Баланс</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Рефералы</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => {
                  const l1Count = getInvitedUsers(user.id, 1).length;
                  const l2Count = getInvitedUsers(user.id, 2).length;
                  const l3Count = getInvitedUsers(user.id, 3).length;
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={user.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="text-xs font-black text-gray-900 uppercase tracking-tight">{user.fullName}</div>
                            <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-gray-600">{user.email}</span>
                          <span className="text-[10px] font-black text-blue-500">{user.tgId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Award size={14} className="text-blue-500" />
                          <span className="text-xs font-black text-gray-900">{user.bonusBalance}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <div className="flex flex-col items-center px-2 py-1 bg-blue-50 rounded-lg min-w-[40px]">
                            <span className="text-[8px] font-black text-blue-400 uppercase">L1</span>
                            <span className="text-[10px] font-black text-blue-600">{l1Count}</span>
                          </div>
                          <div className="flex flex-col items-center px-2 py-1 bg-purple-50 rounded-lg min-w-[40px]">
                            <span className="text-[8px] font-black text-purple-400 uppercase">L2</span>
                            <span className="text-[10px] font-black text-purple-600">{l2Count}</span>
                          </div>
                          <div className="flex flex-col items-center px-2 py-1 bg-pink-50 rounded-lg min-w-[40px]">
                            <span className="text-[8px] font-black text-pink-400 uppercase">L3</span>
                            <span className="text-[10px] font-black text-pink-600">{l3Count}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            fetchUserHistory(user.id);
                          }}
                          className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <HistoryIcon size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Stats Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
            <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <img src={selectedUser.photo} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                  <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{selectedUser.fullName}</h3>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Партнерская статистика</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Stats & Levels */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(level => {
                        const invited = getInvitedUsers(selectedUser.id, level);
                        const totalEarned = userHistory
                          .filter(h => h.type === 'referral' && h.description.includes(`(L${level})`))
                          .reduce((sum, h) => sum + h.amount, 0);
                        return (
                          <div key={level} className="p-6 rounded-[32px] bg-gray-50 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity" />
                            <div className="relative z-10">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Уровень {level}</span>
                              <div className="text-3xl font-black text-gray-900 mb-1">{invited.length}</div>
                              <div className="text-[10px] font-bold text-green-600 uppercase tracking-tight">+{totalEarned} баллов</div>
                              
                              {invited.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-2">
                                  {invited.slice(0, 5).map(u => (
                                    <div key={u.id} className="flex items-center gap-2">
                                      <img src={u.photo} alt="" className="w-4 h-4 rounded-full object-cover" />
                                      <span className="text-[8px] font-bold text-gray-600 truncate">{u.fullName}</span>
                                    </div>
                                  ))}
                                  {invited.length > 5 && (
                                    <div className="text-[8px] font-bold text-gray-400 uppercase">и еще {invited.length - 5}...</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <HistoryIcon size={16} className="text-blue-600" /> История операций
                        </h4>
                      </div>
                      
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {isHistoryLoading ? (
                          <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                          </div>
                        ) : userHistory.length > 0 ? (
                          userHistory.map(item => (
                            <div key={item.id} className="p-4 rounded-2xl bg-white border border-gray-100 flex justify-between items-center hover:border-blue-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                  {item.amount > 0 ? <TrendingUpIcon size={16} /> : <TrendingDown size={16} />}
                                </div>
                                <div>
                                  <div className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{item.description}</div>
                                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</div>
                                </div>
                              </div>
                              <div className={`text-sm font-black ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.amount > 0 ? '+' : ''}{item.amount}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">История пуста</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Management */}
                  <div className="space-y-6">
                    <div className="p-6 rounded-[32px] bg-blue-600 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <Award size={20} className="text-blue-200" />
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Текущий баланс</span>
                        </div>
                        <div className="text-4xl font-black mb-1">{selectedUser.bonusBalance}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Бонусных баллов</div>
                      </div>
                    </div>

                    <div className="p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm space-y-4">
                      <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" /> Ручное управление
                      </h4>
                      
                      <form onSubmit={handleDeductBonuses} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Сумма (±)</label>
                          <input 
                            type="number"
                            value={deductAmount}
                            onChange={(e) => setDeductAmount(e.target.value)}
                            placeholder="Напр: -100 или 50"
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Причина</label>
                          <input 
                            type="text"
                            value={deductDescription}
                            onChange={(e) => setDeductDescription(e.target.value)}
                            placeholder="Основание для изменения"
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isDeducting || !deductAmount}
                          className="w-full bg-gray-900 text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                          {isDeducting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>Применить <Check size={14} /></>
                          )}
                        </button>
                      </form>
                    </div>

                    <div className="p-6 rounded-[32px] bg-amber-50 border border-amber-100">
                      <p className="text-[9px] font-bold text-amber-700 leading-relaxed">
                        <span className="font-black uppercase block mb-1">Внимание!</span>
                        Изменения баланса применяются мгновенно и отображаются в истории операций пользователя.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProducts = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Управление товарами</h2>
          <button 
            onClick={() => {
              setEditingProduct({
                name: '',
                price: 0,
                description: '',
                category: Category.TEA,
                image: '',
                benefits: [],
                usage: '',
                color: '#E1BEE7'
              });
              setIsAddingProduct(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
          >
            <Plus size={16} /> Добавить товар
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-blue-600 shadow-sm hover:bg-white transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-500 shadow-sm hover:bg-white transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-tight">{product.name}</h3>
                  <span className="text-blue-600 font-black text-xl">{product.price}₽</span>
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                <div className="flex flex-wrap gap-1">
                  {product.benefits.slice(0, 3).map((b, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-50 rounded-md text-[8px] font-bold uppercase tracking-widest text-gray-400">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Ensure benefits is an array if it was edited as a string
    const productToSave = {
      ...editingProduct,
      benefits: Array.isArray(editingProduct.benefits) 
        ? editingProduct.benefits 
        : (editingProduct.benefits as unknown as string).split(',').map(b => b.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave)
      });
      const saved = await res.json();
      
      if (editingProduct.id) {
        setProducts(prev => prev.map(p => p.id === saved.id ? saved : p));
      } else {
        setProducts(prev => [...prev, saved]);
      }
      setEditingProduct(null);
      setIsAddingProduct(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setIsDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!isDeletingId) return;
    try {
      await fetch(`/api/admin/products/${isDeletingId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== isDeletingId));
      setIsDeletingId(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                <Lock size={32} />
              </div>
              
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">Админ-панель</h1>
              <p className="text-sm font-medium text-gray-400 mb-8">Введите пароль для доступа к управлению магазином</p>
              
              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className="relative">
                  <input 
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Пароль"
                    className={`w-full bg-gray-50 border-2 ${passwordError ? 'border-red-200 ring-red-50' : 'border-transparent focus:ring-blue-500'} rounded-2xl py-4 px-6 text-center font-bold text-gray-900 focus:ring-4 transition-all outline-none`}
                    autoFocus
                  />
                  {passwordError && (
                    <div className="absolute -bottom-6 left-0 right-0 text-[10px] font-black uppercase tracking-widest text-red-500 animate-bounce">
                      Неверный пароль
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-200"
                >
                  Войти <LogIn size={18} />
                </button>
              </form>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={12} /> Назад в магазин
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Montserrat']">
      {/* Sidebar / Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Админ-панель</h1>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest leading-none">Цветастый</p>
              </div>
            </div>
            
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Товары
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Заказы
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Пользователи
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="Выйти"
              >
                <LogOut size={18} />
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">В магазин</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' ? renderProducts() : 
         activeTab === 'orders' ? renderOrders() : renderUsers()}
      </main>

      {/* Edit/Add Product Modal */}
      {(editingProduct || isAddingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} />
          <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  {isAddingProduct ? <Plus size={20} /> : <Edit3 size={20} />}
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {isAddingProduct ? 'Новый товар' : 'Редактировать'}
                </h3>
              </div>
              <button onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Наименование</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="text" 
                      required
                      value={editingProduct?.name || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      placeholder="Название товара"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Цена (₽)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="number" 
                      required
                      value={editingProduct?.price || ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Категория</label>
                  <select 
                    value={editingProduct?.category || Category.TEA}
                    onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Фото товара</label>
                  <div className="flex flex-col gap-3">
                    {editingProduct?.image && (
                      <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img src={editingProduct.image} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setEditingProduct(prev => ({ ...prev, image: '' }))}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-red-500 shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <label className={`flex-1 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="bg-blue-50 text-blue-600 rounded-2xl py-4 px-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                          {isUploading ? (
                            <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                          ) : (
                            <ImageIcon size={16} />
                          )}
                          {isUploading ? 'Загрузка...' : 'Загрузить файл'}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      <div className="flex-[2] relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          type="text" 
                          value={editingProduct?.image || ''}
                          onChange={e => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                          placeholder="Или вставьте ссылку..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Цвет акцента (HEX)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={editingProduct?.color || '#E1BEE7'}
                      onChange={e => setEditingProduct(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-12 rounded-xl border-none p-0 overflow-hidden cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={editingProduct?.color || '#E1BEE7'}
                      onChange={e => setEditingProduct(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 bg-gray-50 border-none rounded-2xl px-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      placeholder="#E1BEE7"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Преимущества (через запятую)</label>
                <div className="relative">
                  <Check className="absolute left-4 top-4 text-gray-300" size={16} />
                  <textarea 
                    rows={2}
                    value={Array.isArray(editingProduct?.benefits) ? editingProduct?.benefits.join(', ') : editingProduct?.benefits || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, benefits: e.target.value as any }))}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                    placeholder="Улучшает сон, Снимает стресс..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Описание</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-gray-300" size={16} />
                  <textarea 
                    required
                    rows={3}
                    value={editingProduct?.description || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                    placeholder="Краткое описание товара..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Способ применения</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 text-gray-300" size={16} />
                  <textarea 
                    required
                    rows={2}
                    value={editingProduct?.usage || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev, usage: e.target.value }))}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                    placeholder="Как использовать товар..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }}
                  className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className={`bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100 hover:scale-105 transition-transform ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Загрузка фото...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsDeletingId(null)} />
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 relative z-10 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Удалить товар?</h3>
            <p className="text-xs font-medium text-gray-400 mb-8">Это действие нельзя будет отменить. Вы уверены?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeletingId(null)}
                className="flex-1 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
