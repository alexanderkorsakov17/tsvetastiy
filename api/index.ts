import express from "express";
import * as path from "path";
import axios from "axios";
import _cookieSession from "cookie-session";
import { ExpressAuth, getSession } from "@auth/express";
import VkProvider from "@auth/core/providers/vk";

const cookieSession = (_cookieSession as any).default || _cookieSession;

const app = express();
const PORT = 3000;

// Health check before any middleware
app.get("/api/health-check", (req, res) => res.send("OK"));

console.log("API Index starting. VERCEL:", process.env.VERCEL, "NODE_ENV:", process.env.NODE_ENV);
console.log("cookieSession type:", typeof cookieSession);

// Middleware
app.set('trust proxy', 1);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Auth.js Configuration
const authConfig = {
  providers: [
    VkProvider({
      clientId: process.env.VK_CLIENT_ID || "54511533",
      clientSecret: process.env.VK_CLIENT_SECRET || "xKjOWQqGuSI9B9mU3M8p",
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, profile }: any) {
      if (profile) {
        token.sub = profile.id?.toString() || profile.user_id?.toString();
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET || "default-auth-secret-key-1234567890",
  trustHost: true,
};

// Session middleware for Auth.js
app.use(async (req, res, next) => {
  res.locals.session = await getSession(req, authConfig);
  next();
});

try {
  app.use(
    cookieSession({
      name: "session",
      keys: [process.env.SESSION_SECRET || "default-secret-key"],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: true,
      sameSite: "none",
      proxy: true,
    })
  );
  console.log("cookieSession middleware initialized");
} catch (e) {
  console.error("Failed to initialize cookieSession:", e);
}

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Express Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
  });
});

// Admin Secret Path
const ADMIN_SECRET = "admin-secret-9922";

// In-memory data store
let products = [
  {
    id: '1',
    name: 'Лавандовый сон',
    category: 'Чай для ванн',
    description: 'Успокаивающий чай для ванны с цельными цветками лаванды.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=400&h=400&auto=format&fit=crop',
    benefits: ['Улучшает сон', 'Снимает стресс', 'Смягчает кожу'],
    usage: 'Опустите пакетик в горячую ванну на 5-10 минут. Не разрывайте пакет.',
    color: '#E1BEE7'
  },
  {
    id: '2',
    name: 'Бутоны роз',
    category: 'Травы',
    description: 'Натуральные сушеные бутоны роз для эстетики и ароматерапии.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1596435086888-295326466f8e?q=80&w=400&h=400&auto=format&fit=crop',
    benefits: ['Увлажнение', 'Антиоксиданты', 'Романтичное настроение'],
    usage: 'Рассыпьте по поверхности воды или добавьте в чайный пакетик для ванны.',
    color: '#F8BBD0'
  },
  {
    id: '3',
    name: 'Мятная свежесть',
    category: 'Травы',
    description: 'Перечная мята и мелисса для бодрости духа.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=400&h=400&auto=format&fit=crop',
    benefits: ['Освежает', 'Снимает головную боль', 'Тонизирует'],
    usage: 'Идеально для утренней ванны или ванночки для ног.',
    color: '#C8E6C9'
  },
  {
    id: '4',
    name: 'Гранулированная свеча "Небо"',
    category: 'Свечи',
    description: 'Голубой насыпной воск. Создайте свою уникальную свечу.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?q=80&w=400&h=400&auto=format&fit=crop',
    benefits: ['Чистое горение', 'Яркий цвет', 'Без запаха'],
    usage: 'Насыпьте в стеклянную емкость, вставьте фитиль и зажгите.',
    color: '#BBDEFB'
  },
  {
    id: '5',
    name: 'Розовая соль Эпсома',
    category: 'Соль',
    description: 'Чистейшая английская соль с добавлением эфирных масел.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=400&h=400&auto=format&fit=crop',
    benefits: ['Детокс', 'Расслабление мышц', 'Уход за кожей'],
    usage: 'Растворите 200-300г соли в теплой воде перед принятием ванны.',
    color: '#F48FB1'
  },
  {
    id: '6',
    name: 'Набор "Полный Дзен"',
    category: 'Комплексы',
    description: 'Подарочный комплекс: чай для ванны, свеча и соль.',
    price: 1290,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400&h=400&auto=format&fit=crop',
    benefits: ['Идеальный подарок', 'Комплексный релакс', 'Экономия 15%'],
    usage: 'Используйте все компоненты последовательно для создания СПА-атмосферы.',
    color: '#FFE082'
  }
];

let orders: any[] = [];
let users: any[] = [
  {
    id: "mock_user_1",
    name: "Анна",
    fullName: "Анна Иванова",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
    city: "Москва",
    birthDate: "15.05.1995",
    email: "anna@example.com",
    tgId: "@anna_ivanova",
    orderCount: 5,
    bonusBalance: 1250,
    createdAt: "01.01.2024"
  },
  {
    id: "mock_user_2",
    name: "Дмитрий",
    fullName: "Дмитрий Петров",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop",
    city: "Санкт-Петербург",
    birthDate: "20.10.1988",
    email: "dima@example.com",
    tgId: "@dima_p",
    orderCount: 2,
    bonusBalance: 450,
    invitedBy: "mock_user_1",
    createdAt: "10.01.2024"
  },
  {
    id: "mock_user_3",
    name: "Елена",
    fullName: "Елена Сидорова",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
    city: "Казань",
    birthDate: "05.03.1992",
    email: "elena@example.com",
    tgId: "@elena_s",
    orderCount: 1,
    bonusBalance: 300,
    invitedBy: "mock_user_2",
    createdAt: "15.01.2024"
  },
  {
    id: "mock_user_4",
    name: "Сергей",
    fullName: "Сергей Волков",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop",
    city: "Екатеринбург",
    birthDate: "12.12.1985",
    email: "sergey@example.com",
    tgId: "@sergey_v",
    orderCount: 0,
    bonusBalance: 100,
    invitedBy: "mock_user_1",
    createdAt: "20.01.2024"
  }
];

let bonusHistory: any[] = [
  { id: "h1", userId: "mock_user_1", type: "referral", amount: 100, description: "Бонус за приглашение Дмитрия (Уровень 1)", date: "10.01.2024" },
  { id: "h2", userId: "mock_user_1", type: "referral", amount: 50, description: "Бонус за приглашение Елены (Уровень 2)", date: "15.01.2024" },
  { id: "h3", userId: "mock_user_2", type: "referral", amount: 100, description: "Бонус за приглашение Елены (Уровень 1)", date: "15.01.2024" },
  { id: "h4", userId: "mock_user_1", type: "earn", amount: 45, description: "Кэшбэк за заказ #12345", date: "05.02.2024" },
];

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Public API: Get Products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Public API: Create Order
app.post("/api/orders", (req, res) => {
  const user = req.session?.user;
  const order = {
    ...req.body,
    id: Math.floor(Math.random() * 90000 + 10000).toString(),
    date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: 'created',
    userId: user?.id || 'anonymous',
    userName: user?.fullName || 'Гость',
    userContact: user?.email || user?.tgId || 'Нет контактов'
  };
  orders.unshift(order);

  // Referral Bonus Logic
  if (user && user.invitedBy) {
    const awardBonus = (inviterId: string, amount: number, level: number, buyerName: string) => {
      const inviterIdx = users.findIndex(u => u.id === inviterId);
      if (inviterIdx !== -1) {
        users[inviterIdx].bonusBalance += amount;
        bonusHistory.unshift({
          id: Date.now().toString() + Math.random(),
          userId: inviterId,
          type: 'referral',
          amount,
          description: `Бонус за заказ ${buyerName} (L${level})`,
          date: new Date().toLocaleDateString('ru-RU')
        });
        return users[inviterIdx].invitedBy;
      }
      return null;
    };

    const l1Bonus = Math.round(order.total * 0.1);
    const l2Bonus = Math.round(order.total * 0.05);
    const l3Bonus = Math.round(order.total * 0.02);

    const l1InviterId = user.invitedBy;
    const l2InviterId = l1InviterId ? awardBonus(l1InviterId, l1Bonus, 1, user.fullName) : null;
    const l3InviterId = l2InviterId ? awardBonus(l2InviterId, l2Bonus, 2, user.fullName) : null;
    if (l3InviterId) awardBonus(l3InviterId, l3Bonus, 3, user.fullName);
  }

  res.json(order);
});

// Public API: Get My Orders
app.get("/api/orders/my", (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) return res.json([]);
  const myOrders = orders.filter(o => o.userId === userId);
  res.json(myOrders);
});

// Admin API: Get All Orders
app.get("/api/admin/orders", (req, res) => {
  res.json(orders);
});

// Admin API: Update Order Status
app.patch("/api/admin/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orderIndex = orders.findIndex(o => o.id === id);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    res.json(orders[orderIndex]);
  } else {
    res.status(404).send("Order not found");
  }
});

// Admin API: Update Product
app.post("/api/admin/products", (req, res) => {
  const product = req.body;
  if (product.id) {
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
    } else {
      products.push(product);
    }
  } else {
    product.id = Date.now().toString();
    products.push(product);
  }
  res.json(product);
});

// Admin API: Delete Product
app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

// Admin API: Get All Users
app.get("/api/admin/users", (req, res) => {
  res.json(users);
});

// Admin API: Get User Bonus History
app.get("/api/admin/users/:id/history", (req, res) => {
  const { id } = req.params;
  const history = bonusHistory.filter(h => h.userId === id);
  res.json(history);
});

// Admin API: Adjust User Bonuses
app.patch("/api/admin/users/:id/bonuses", (req, res) => {
  const { id } = req.params;
  const { amount, description, type = 'manual' } = req.body;
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    const adjustment = Number(amount);
    users[userIndex].bonusBalance += adjustment;
    
    const transaction = {
      id: Date.now().toString(),
      userId: id,
      type,
      amount: Math.abs(adjustment),
      description: description || (adjustment > 0 ? 'Начисление баллов администратором' : 'Списание баллов администратором'),
      date: new Date().toLocaleDateString('ru-RU')
    };
    bonusHistory.unshift(transaction);
    
    res.json({ user: users[userIndex], transaction });
  } else {
    res.status(404).send("User not found");
  }
});

// Get current user
app.get("/api/auth/me", async (req, res) => {
  // Try to get session from Auth.js first
  const session = (res as any).locals.session;
  
  if (session?.user) {
    // Map Auth.js session to our internal user format
    const vkId = session.user.id;
    const existingUser = users.find(u => u.id === vkId);
    
    if (!existingUser) {
      const newUser = {
        id: vkId,
        name: session.user.name?.split(' ')[0] || "Пользователь",
        fullName: session.user.name || "Пользователь",
        photo: session.user.image || "https://picsum.photos/seed/user/200/200",
        city: "Не указан",
        birthDate: "Не указана",
        email: session.user.email || "",
        tgId: "",
        orderCount: 0,
        bonusBalance: 0,
        createdAt: new Date().toLocaleDateString('ru-RU')
      };
      users.push(newUser);
      req.session!.user = newUser;
    } else {
      req.session!.user = existingUser;
    }
  }

  res.json({ user: req.session?.user || null });
});

// Update profile
app.patch("/api/auth/profile", (req, res) => {
  if (req.session?.user) {
    req.session.user = { ...req.session.user, ...req.body };
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session = null;
  res.json({ success: true });
});

// Mock Login (Temporary bypass)
app.post("/api/auth/mock", (req, res) => {
  console.log("Mock login request received. Session exists:", !!req.session);
  const mockUser = {
    id: "mock_user_123",
    name: "Гость",
    fullName: "Гость Приложения",
    photo: "https://picsum.photos/seed/user/200/200",
    city: "Москва",
    birthDate: "01.01.1990",
    email: "guest@example.com",
    tgId: "@guest",
    orderCount: 0,
    bonusBalance: 840,
    createdAt: "01.01.2024"
  };

  const existingUserIdx = users.findIndex(u => u.id === mockUser.id);
  if (existingUserIdx === -1) {
    users.push(mockUser);
  }

  req.session!.user = users.find(u => u.id === mockUser.id);
  res.json({ user: req.session!.user });
});

// Mount Auth.js at /api/auth
app.use("/api/auth", ExpressAuth(authConfig));

// Server initialization
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Vite dev server failed to start:", e);
    }
  } else if (!process.env.VERCEL) {
    // Only serve static files if NOT on Vercel (Vercel handles static files automatically)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/*path", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
};

startServer().catch(err => {
  console.error("Failed to start server:", err);
});

export default app;
