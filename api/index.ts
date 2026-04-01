import express from "express";
import * as path from "path";
import axios from "axios";
import _cookieSession from "cookie-session";

const cookieSession = (_cookieSession as any).default || _cookieSession;

import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// Import the Firebase configuration
import firebaseConfig from "../firebase-applet-config.json" with { type: "json" };

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : null;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: firebaseConfig.projectId
    });
    console.log("Firebase Admin initialized with Service Account");
  } else {
    // Fallback for local dev or if key is missing (will still fail if rules are strict)
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
    console.log("Firebase Admin initialized with Project ID only (no Service Account)");
  }
}

const db = getFirestore(admin.apps[0], firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)' ? firebaseConfig.firestoreDatabaseId : undefined);

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

// In-memory data store (only products remain for now, but could also be moved)
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
let users: any[] = [];
let bonusHistory: any[] = [];

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Public API: Get Products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Public API: Create Order
app.post("/api/orders", async (req, res) => {
  const user = req.session?.user;
  const { total, bonusUsed = 0 } = req.body;
  
  const orderId = Math.floor(Math.random() * 90000 + 10000).toString();
  const order = {
    ...req.body,
    id: orderId,
    date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: 'created',
    userId: user?.id || 'anonymous',
    userName: user?.fullName || 'Гость',
    userContact: user?.email || user?.tgId || 'Нет контактов'
  };

  try {
    const orderRef = db.collection("orders").doc(orderId);
    await orderRef.set(order);

    // Update user balance if bonuses were used
    if (user && bonusUsed > 0) {
      const userRef = db.collection("users").doc(user.id);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data()!;
        const newBalance = (userData.bonusBalance || 0) - bonusUsed;
        await userRef.update({ bonusBalance: newBalance });
        
        const transactionId = Date.now().toString() + Math.random();
        await db.collection("bonusHistory").doc(transactionId).set({
          id: transactionId,
          userId: user.id,
          type: 'spend',
          amount: bonusUsed,
          description: `Оплата баллами заказа #${orderId}`,
          date: new Date().toLocaleDateString('ru-RU')
        });
        
        // Update session user
        req.session!.user = { ...userData, bonusBalance: newBalance };
      }
    }

    // Cashback Logic
    if (user) {
      const cashback = Math.round(order.total * 0.05);
      if (cashback > 0) {
        const userRef = db.collection("users").doc(user.id);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data()!;
          const newBalance = (userData.bonusBalance || 0) + cashback;
          await userRef.update({ 
            bonusBalance: newBalance,
            orderCount: (userData.orderCount || 0) + 1
          });
          
          const transactionId = Date.now().toString() + Math.random();
          await db.collection("bonusHistory").doc(transactionId).set({
            id: transactionId,
            userId: user.id,
            type: 'earn',
            amount: cashback,
            description: `Кэшбэк за заказ #${orderId}`,
            date: new Date().toLocaleDateString('ru-RU')
          });
          
          // Update session user
          req.session!.user = { ...userData, bonusBalance: newBalance, orderCount: (userData.orderCount || 0) + 1 };
        }
      }
    }

    // Referral Bonus Logic
    if (user && user.invitedBy) {
      const awardBonus = async (inviterId: string, amount: number, level: number, buyerName: string) => {
        const inviterRef = db.collection("users").doc(inviterId);
        const inviterDoc = await inviterRef.get();
        if (inviterDoc.exists) {
          const inviterData = inviterDoc.data()!;
          const newBalance = (inviterData.bonusBalance || 0) + amount;
          await inviterRef.update({ bonusBalance: newBalance });
          
          const transactionId = Date.now().toString() + Math.random();
          await db.collection("bonusHistory").doc(transactionId).set({
            id: transactionId,
            userId: inviterId,
            type: 'referral',
            amount,
            description: `Бонус за заказ ${buyerName} (L${level})`,
            date: new Date().toLocaleDateString('ru-RU')
          });
          return inviterData.invitedBy;
        }
        return null;
      };

      const l1Bonus = Math.round(order.total * 0.1);
      const l2Bonus = Math.round(order.total * 0.05);
      const l3Bonus = Math.round(order.total * 0.02);

      const l1InviterId = user.invitedBy;
      const l2InviterId = l1InviterId ? await awardBonus(l1InviterId, l1Bonus, 1, user.fullName) : null;
      const l3InviterId = l2InviterId ? await awardBonus(l2InviterId, l2Bonus, 2, user.fullName) : null;
      if (l3InviterId) await awardBonus(l3InviterId, l3Bonus, 3, user.fullName);
    }

    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Public API: Get My Orders
app.get("/api/orders/my", async (req, res) => {
  const userId = req.session?.user?.id;
  if (!userId) return res.json([]);
  
  try {
    const querySnapshot = await db.collection("orders").where("userId", "==", userId).get();
    const myOrders = querySnapshot.docs.map(doc => doc.data());
    res.json(myOrders);
  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin API: Get All Orders
app.get("/api/admin/orders", async (req, res) => {
  try {
    const querySnapshot = await db.collection("orders").get();
    const allOrders = querySnapshot.docs.map(doc => doc.data());
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin API: Update Order Status
app.patch("/api/admin/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const orderRef = db.collection("orders").doc(id);
    await orderRef.update({ status });
    const updatedDoc = await orderRef.get();
    res.json(updatedDoc.data());
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order" });
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

// User API: Get My Bonus History
app.get("/api/users/me/history", async (req, res) => {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const querySnapshot = await db.collection("bonusHistory").where("userId", "==", user.id).get();
    const history = querySnapshot.docs.map(doc => doc.data());
    res.json(history);
  } catch (error) {
    console.error("Error fetching bonus history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// User API: Get My Referrals
app.get("/api/users/me/referrals", async (req, res) => {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const querySnapshot = await db.collection("users").where("invitedBy", "==", user.id).get();
    const referrals = querySnapshot.docs.map(doc => doc.data());
    res.json(referrals);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
});

// Admin API: Get All Users
app.get("/api/admin/users", async (req, res) => {
  try {
    const querySnapshot = await db.collection("users").get();
    const allUsers = querySnapshot.docs.map(doc => doc.data());
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Admin API: Get User Bonus History
app.get("/api/admin/users/:id/history", async (req, res) => {
  const { id } = req.params;
  try {
    const querySnapshot = await db.collection("bonusHistory").where("userId", "==", id).get();
    const history = querySnapshot.docs.map(doc => doc.data());
    res.json(history);
  } catch (error) {
    console.error("Error fetching user bonus history:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Admin API: Adjust User Bonuses
app.patch("/api/admin/users/:id/bonuses", async (req, res) => {
  const { id } = req.params;
  const { amount, description, type = 'manual' } = req.body;
  
  try {
    const userRef = db.collection("users").doc(id);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const userData = userDoc.data()!;
      const adjustment = Number(amount);
      const newBalance = (userData.bonusBalance || 0) + adjustment;
      
      await userRef.update({ bonusBalance: newBalance });
      
      const transactionId = Date.now().toString();
      const transaction = {
        id: transactionId,
        userId: id,
        type,
        amount: Math.abs(adjustment),
        description: description || (adjustment > 0 ? 'Начисление баллов администратором' : 'Списание баллов администратором'),
        date: new Date().toLocaleDateString('ru-RU')
      };
      await db.collection("bonusHistory").doc(transactionId).set(transaction);
      
      res.json({ user: { ...userData, bonusBalance: newBalance }, transaction });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error adjusting bonuses:", error);
    res.status(500).json({ error: "Failed to adjust bonuses" });
  }
});

// Get current user
app.get("/api/auth/me", async (req, res) => {
  res.json({ user: req.session?.user || null });
});

// VK ID One Tap Login Handler
app.post("/api/auth/vkid", async (req, res) => {
  const { code, device_id, access_token } = req.body;
  
  let final_access_token = access_token;

  try {
    // Если токен не пришел с фронтенда, пробуем обменять код (старый флоу)
    if (!final_access_token) {
      if (!code || !device_id) {
        return res.status(400).json({ error: "Missing code, device_id or access_token" });
      }

      let origin = process.env.APP_URL;
      // In dev or if APP_URL is missing, use the request's origin
      if (!origin || process.env.NODE_ENV !== "production") {
        const referer = req.headers.referer || "https://tsvetastiy.vercel.app";
        const url = new URL(referer);
        origin = `${url.protocol}//${url.host}`;
      }
      const redirect_uri = `${origin}/api/auth/callback/vk`;
      console.log("VK Exchange Redirect URI:", redirect_uri, "NODE_ENV:", process.env.NODE_ENV);

      // Exchange code for access token
      const tokenResponse = await axios.post("https://id.vk.com/oauth2/auth", 
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          device_id: device_id,
          client_id: process.env.VK_CLIENT_ID || "54511533",
          client_secret: process.env.VK_CLIENT_SECRET || "xKjOWQqGuSI9B9mU3M8p",
          redirect_uri: redirect_uri
        }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      ).catch(err => {
        console.error("VK Token Exchange Axios Error:", err.response?.data || err.message);
        throw err;
      });

      console.log("VK Token Response Data:", JSON.stringify(tokenResponse.data));

      const { access_token: exchangedToken, error: tokenError, error_description } = tokenResponse.data;

      if (tokenError) {
        console.error("VK Token Error:", tokenError, error_description);
        return res.status(400).json({ error: tokenError, details: error_description });
      }
      
      final_access_token = exchangedToken;
    }

    if (!final_access_token) {
      console.error("Missing access_token after exchange attempt");
      return res.status(500).json({ error: "Failed to obtain access_token" });
    }

    // Get user info
    const userResponse = await axios.post("https://id.vk.com/oauth2/user_info",
      new URLSearchParams({
        access_token: final_access_token,
        client_id: process.env.VK_CLIENT_ID || "54511533",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    ).catch(err => {
      console.error("VK User Info Axios Error:", err.response?.data || err.message);
      throw err;
    });

    console.log("VK User Info Response Data:", JSON.stringify(userResponse.data));

    const vkUser = userResponse.data.user;
    if (!vkUser) {
      console.error("VK User Info missing user object:", userResponse.data);
      return res.status(500).json({ error: "Missing user data from VK", details: userResponse.data });
    }

    const vkId = vkUser.user_id.toString();
    const { invitedBy } = req.body;

    const userRef = db.collection("users").doc(vkId);
    let existingUserDoc = await userRef.get();
    let existingUser = existingUserDoc.exists ? existingUserDoc.data() : null;
    
    if (!existingUser) {
      existingUser = {
        id: vkId,
        name: vkUser.first_name || "Пользователь",
        fullName: `${vkUser.first_name} ${vkUser.last_name}`.trim() || "Пользователь",
        photo: vkUser.avatar || "https://picsum.photos/seed/user/200/200",
        city: "Не указан",
        birthDate: "Не указана",
        email: vkUser.email || "",
        tgId: "",
        orderCount: 0,
        bonusBalance: 0,
        invitedBy: invitedBy || undefined,
        createdAt: new Date().toLocaleDateString('ru-RU')
      };
      await userRef.set(existingUser);

      // If user was invited, give bonus to inviter
      if (invitedBy) {
        const inviterRef = db.collection("users").doc(invitedBy);
        const inviterDoc = await inviterRef.get();
        if (inviterDoc.exists) {
          const inviterData = inviterDoc.data()!;
          const bonusAmount = 100; // Registration bonus
          const newBalance = (inviterData.bonusBalance || 0) + bonusAmount;
          await inviterRef.update({ bonusBalance: newBalance });
          
          const transactionId = Date.now().toString() + Math.random();
          await db.collection("bonusHistory").doc(transactionId).set({
            id: transactionId,
            userId: invitedBy,
            type: 'referral',
            amount: bonusAmount,
            description: `Бонус за регистрацию друга: ${existingUser.name}`,
            date: new Date().toLocaleDateString('ru-RU')
          });
        }
      }
    }

    req.session!.user = existingUser;
    res.json({ user: existingUser });
  } catch (error: any) {
    const errorData = error.response?.data;
    console.error("VK ID Exchange Error:", errorData || error.message);
    res.status(500).json({ 
      error: "Failed to authenticate with VK ID",
      details: errorData || error.message
    });
  }
});

// Update profile
app.patch("/api/auth/profile", async (req, res) => {
  if (req.session?.user) {
    const userId = req.session.user.id;
    try {
      const userRef = db.collection("users").doc(userId);
      await userRef.update(req.body);
      const updatedDoc = await userRef.get();
      req.session.user = updatedDoc.data();
      res.json({ user: req.session.user });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
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
app.post("/api/auth/mock", async (req, res) => {
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

  try {
    const userRef = db.collection("users").doc(mockUser.id);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set(mockUser);
    }
    
    const finalUser = (await userRef.get()).data();
    req.session!.user = finalUser;
    res.json({ user: finalUser });
  } catch (error) {
    console.error("Mock login error:", error);
    res.status(500).json({ error: "Failed to mock login" });
  }
});

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
