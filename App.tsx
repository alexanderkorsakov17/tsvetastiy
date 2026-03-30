
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Sparkles, User, Heart, ChevronRight, X, Sparkle, Share2, Copy, Users, Gift, TrendingUp, Wallet, Info, Trash2, Plus, Minus, Award, Target, Zap, ChevronDown, ChevronUp, History, ArrowUpRight, ArrowDownLeft, Send, MessageSquare, ExternalLink, Clock, LogOut, ShieldCheck, Edit3, MapPin, Calendar, Check, Search, Truck, Package, Store, Home, AlertCircle, ThumbsUp, Coins, Repeat, HeartHandshake, Layers, Moon, Sun, Maximize2, Minimize2, ChevronLeft, Navigation, CreditCard, ArrowRight, RefreshCw } from 'lucide-react';
import { YMaps, Map, Placemark, ZoomControl, useYMaps } from '@pbe/react-yandex-maps';

import { PRODUCTS as INITIAL_PRODUCTS, RELAX_TIPS, RUSSIA_CITIES } from './constants';
import { Product, Category, RelaxTip, Message } from './types';
import { getRecommendation } from './geminiService';
import { AdminPanel } from './AdminPanel';
const TextLogo = ({ className = "h-10" }: { className?: string }) => (
  <svg 
    version="1.0" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 930.000000 208.000000"
    preserveAspectRatio="xMidYMid meet"
    className={className}
  >
    <g 
      transform="translate(0.000000,208.000000) scale(0.100000,-0.100000)"
      fill="currentColor" 
      stroke="none"
    >
      <path d="M8750 1625 c0 -96 3 -115 15 -115 12 0 15 19 15 115 0 96 -3 115 -15
      115 -12 0 -15 -19 -15 -115z"/>
      <path d="M1310 1633 c-14 -2 -37 -9 -52 -15 l-28 -10 0 -477 0 -477 33 -31
      c113 -110 298 -158 452 -118 211 55 365 251 365 463 0 258 -191 464 -451 488
      -64 6 -68 9 -80 37 -38 91 -144 153 -239 140z m100 -75 c42 -22 94 -81 88
      -100 -2 -5 -30 -20 -63 -33 -33 -14 -79 -38 -103 -55 -23 -16 -45 -30 -47 -30
      -3 0 -5 50 -5 110 0 105 1 111 23 120 36 14 60 11 107 -12z m295 -173 c123
      -32 217 -112 278 -234 30 -62 32 -72 32 -176 0 -103 -2 -114 -32 -178 -42 -89
      -121 -168 -210 -210 -64 -30 -75 -32 -178 -32 -99 0 -116 3 -169 28 -33 15
      -79 43 -103 63 l-43 35 0 286 0 285 41 38 c104 95 247 130 384 95z"/>
      <path d="M5495 1629 c-233 -23 -441 -213 -490 -446 -42 -197 15 -387 159 -528
      136 -134 312 -188 502 -154 57 10 214 75 214 89 0 4 -8 14 -18 23 -16 15 -21
      14 -68 -9 -109 -54 -251 -69 -363 -39 -226 60 -381 263 -381 500 0 144 57 272
      167 375 153 144 372 177 557 85 70 -35 71 -35 90 -16 19 19 18 20 -30 51 -89
      56 -215 82 -339 69z"/>
      <path d="M400 1065 l0 -565 145 0 145 0 0 -80 c0 -47 4 -80 10 -80 6 0 10 43
      10 110 0 67 -4 110 -10 110 -7 0 -10 185 -10 535 l0 535 -30 0 -30 0 0 -535 0
      -535 -85 0 -85 0 0 535 0 535 -30 0 -30 0 0 -565z"/>
      <path d="M2560 1065 l0 -565 145 0 145 0 0 30 0 30 -115 0 -115 0 0 55 0 55
      111 0 110 0 -3 28 -3 27 -107 3 -108 3 0 419 0 420 115 0 115 0 0 30 0 30
      -145 0 -145 0 0 -565z"/>
      <path d="M3370 1600 c0 -30 1 -30 55 -30 l55 0 0 -535 0 -535 30 0 30 0 0 535
      0 535 55 0 c54 0 55 0 55 30 l0 30 -140 0 -140 0 0 -30z"/>
      <path d="M4227 1071 c-54 -310 -97 -564 -95 -566 1 -2 73 23 158 54 l155 58 8
      -36 c5 -20 10 -46 13 -58 3 -17 11 -23 32 -23 l28 0 -93 533 c-51 292 -96 547
      -100 566 -7 27 -29 -85 -106 -528z m153 -75 c28 -158 50 -296 50 -306 0 -13
      -26 -27 -111 -59 -62 -23 -113 -40 -115 -39 -1 2 24 154 56 338 33 184 60 341
      60 349 0 45 16 -27 60 -283z"/>
      <path d="M6330 1600 c0 -30 1 -30 55 -30 l55 0 0 -535 0 -535 30 0 30 0 0 535
      0 535 55 0 c54 0 55 0 55 30 l0 30 -140 0 -140 0 0 -30z"/>
      <path d="M7120 1141 l0 -489 48 -42 c287 -248 730 -88 794 288 41 244 -131
      491 -379 543 -116 23 -262 -6 -352 -71 -22 -17 -43 -30 -46 -30 -3 0 -5 65 -5
      145 l0 145 -30 0 -30 0 0 -489z m552 206 c92 -45 157 -112 201 -205 30 -62 32
      -75 32 -172 0 -97 -2 -110 -32 -172 -44 -93 -109 -160 -200 -205 -63 -31 -87
      -37 -158 -41 -106 -6 -197 20 -278 78 l-57 41 0 294 0 294 43 34 c91 74 162
      98 283 94 82 -3 99 -7 166 -40z"/>
      <path d="M8020 1065 l0 -565 30 0 30 0 0 565 0 565 -30 0 -30 0 0 -565z"/>
      <path d="M8620 1072 c0 -307 3 -561 6 -565 5 -4 114 32 207 68 14 6 17 1 17
      -34 0 -39 2 -41 30 -41 l30 0 0 565 0 565 -30 0 -30 0 0 -494 0 -494 -47 -18
      c-27 -9 -63 -23 -82 -31 -18 -7 -35 -13 -37 -13 -2 0 -4 236 -4 525 l0 525
      -30 0 -30 0 0 -558z"/>
    </g>
  </svg>
);

const SunLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg 
    version="1.0" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300.000000 300.000000"
    preserveAspectRatio="xMidYMid meet"
    className={className}
  >
    <g 
      transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
      fill="currentColor" 
      stroke="none"
    >
      <path d="M1249 2854 c-11 -13 -10 -40 5 -157 17 -139 33 -187 60 -187 7 0 19
      7 26 16 18 21 -3 286 -25 320 -18 28 -47 31 -66 8z"/>
      <path d="M2234 2773 c-17 -12 -98 -114 -140 -177 -32 -49 -36 -61 -28 -84 22
      -63 73 -27 162 117 66 105 75 144 37 149 -11 1 -25 -1 -31 -5z"/>
      <path d="M737 2699 c-13 -7 -15 -17 -10 -37 7 -29 126 -245 151 -274 21 -25
      47 -22 60 7 10 21 6 33 -22 87 -90 174 -127 228 -150 228 -6 0 -19 -5 -29 -11z"/>
      <path d="M1285 2399 c-96 -14 -263 -90 -368 -167 -135 -99 -267 -252 -318
      -368 -52 -116 -96 -353 -84 -448 41 -333 192 -593 437 -752 182 -117 397 -158
      643 -120 269 40 501 209 660 478 48 82 102 247 116 355 17 127 0 321 -37 424
      -74 208 -195 362 -362 464 -162 100 -324 146 -507 144 -66 -1 -147 -5 -180
      -10z m280 -69 c156 -18 270 -60 401 -146 290 -191 418 -595 302 -954 -30 -93
      -91 -214 -141 -279 -53 -71 -58 -74 -75 -50 -22 32 -33 22 -30 -28 2 -38 0
      -48 -14 -51 -12 -2 -19 5 -24 22 -7 28 -29 51 -37 38 -5 -7 -1 -30 14 -92 3
      -9 -5 -16 -18 -18 -15 -2 -23 2 -23 11 0 23 -25 40 -38 25 -7 -9 -6 -20 3 -38
      12 -21 11 -27 -2 -42 -26 -29 -41 -21 -53 25 -16 62 -18 67 -30 67 -13 0 -13
      -5 5 -65 9 -27 13 -55 11 -62 -8 -20 -33 -15 -39 7 -7 27 -29 25 -26 -2 4 -30
      -8 -48 -31 -48 -14 0 -22 11 -30 41 -10 38 -33 59 -47 45 -4 -3 1 -22 10 -41
      23 -49 21 -64 -10 -71 -32 -8 -48 10 -57 66 -4 26 -11 40 -21 40 -24 0 -29
      -28 -12 -70 17 -43 14 -50 -18 -50 -19 0 -24 10 -40 75 -11 49 -22 75 -31 75
      -18 0 -18 -31 0 -98 13 -46 13 -54 0 -59 -32 -12 -42 7 -60 106 -15 83 -22
      101 -36 101 -23 0 -24 -43 -3 -120 19 -70 19 -90 0 -90 -23 0 -36 42 -71 227
      -8 40 -34 28 -34 -14 1 -38 21 -143 35 -175 8 -21 -20 -37 -36 -21 -6 6 -21
      62 -33 124 -17 88 -26 115 -39 117 -23 5 -22 -50 2 -148 11 -41 18 -77 16 -78
      -2 -2 -12 -1 -23 2 -14 5 -22 22 -31 64 -29 149 -46 212 -58 212 -22 0 -23
      -17 -2 -121 21 -112 22 -133 1 -120 -13 8 -43 124 -66 255 -11 68 -30 94 -42
      61 -6 -14 16 -161 33 -218 4 -14 0 -18 -13 -15 -12 2 -22 20 -31 53 -22 82
      -53 222 -58 266 -7 50 -11 59 -32 59 -22 0 -13 -81 27 -234 35 -136 37 -154
      15 -136 -31 26 -120 380 -141 558 -4 39 -11 61 -18 59 -30 -11 7 -299 63 -485
      20 -65 17 -77 -10 -39 -54 74 -122 452 -138 756 -4 78 -10 126 -17 128 -19 6
      -7 -360 16 -502 29 -184 33 -215 26 -215 -27 0 -69 232 -88 487 -13 179 -3
      237 63 364 127 245 386 421 672 458 89 12 112 12 212 1z"/>
      <path d="M1414 2248 c7 -35 22 -56 32 -45 13 12 -6 77 -23 77 -12 0 -14 -7 -9
      -32z"/>
      <path d="M1520 2258 c0 -19 18 -43 25 -36 9 9 -4 48 -16 48 -5 0 -9 -6 -9 -12z"/>
      <path d="M1325 2250 c-8 -13 26 -120 38 -120 4 0 6 8 3 18 -2 9 -8 36 -11 59
      -7 44 -19 61 -30 43z"/>
      <path d="M1236 2232 c-6 -9 18 -119 28 -129 14 -15 18 11 10 68 -8 57 -24 83
      -38 61z"/>
      <path d="M1156 2221 c-8 -13 11 -162 22 -173 15 -15 33 0 28 25 -3 12 -10 52
      -17 90 -10 62 -20 79 -33 58z"/>
      <path d="M1734 2189 c-27 -30 -9 -50 66 -74 48 -16 71 -30 99 -62 28 -33 45
      -44 79 -49 32 -5 42 -3 42 7 0 26 -67 87 -127 118 -33 16 -74 41 -90 55 -37
      31 -45 32 -69 5z"/>
      <path d="M1080 2151 c0 -79 11 -141 26 -141 23 0 25 18 13 105 -8 59 -16 85
      -26 85 -9 0 -13 -14 -13 -49z"/>
      <path d="M1013 2067 c7 -102 14 -130 31 -124 12 4 12 15 1 135 -6 63 -11 82
      -23 82 -13 0 -14 -14 -9 -93z"/>
      <path d="M940 2031 c0 -70 4 -102 13 -110 22 -18 25 -4 20 82 -5 99 -10 127
      -23 127 -6 0 -10 -41 -10 -99z"/>
      <path d="M868 2048 c-8 -21 -10 -128 -3 -159 4 -16 13 -29 21 -29 13 0 14 12
      8 73 -5 39 -7 84 -6 100 1 27 -12 37 -20 15z"/>
      <path d="M788 1933 c3 -93 9 -123 22 -123 11 0 14 158 4 184 -3 9 -11 16 -18
      16 -8 0 -10 -24 -8 -77z"/>
      <path d="M1265 1867 c-34 -16 -87 -72 -111 -119 -27 -53 -30 -146 -6 -200 24
      -55 57 -79 116 -85 83 -10 140 40 189 165 45 114 -13 236 -119 248 -21 2 -53
      -2 -69 -9z m43 -69 c29 -29 7 -78 -35 -78 -35 0 -52 43 -28 70 20 23 45 26 63
      8z m96 -50 c11 -43 6 -73 -23 -134 -32 -67 -61 -94 -102 -94 -32 0 -74 31 -82
      60 -4 17 -2 20 14 15 61 -20 169 76 169 149 0 32 16 34 24 4z"/>
      <path d="M724 1786 c-3 -8 -3 -45 0 -83 3 -37 5 -72 5 -76 1 -5 6 -5 11 -2 13
      8 13 175 0 175 -6 0 -13 -6 -16 -14z"/>
      <path d="M1845 1661 c-58 -27 -102 -78 -125 -145 -37 -109 -23 -185 45 -245
      37 -32 41 -33 102 -28 72 5 102 21 143 78 55 76 66 228 21 285 -29 37 -89 74
      -121 74 -14 0 -43 -9 -65 -19z m-16 -103 c-7 -13 -13 -51 -13 -85 0 -50 5 -69
      28 -103 15 -22 33 -43 41 -47 26 -9 5 -23 -34 -23 -50 0 -82 33 -88 93 -6 47
      15 125 43 165 20 29 38 29 23 0z m146 16 c9 -4 21 -18 26 -32 19 -49 -43 -96
      -79 -60 -17 17 -15 58 5 80 18 20 23 21 48 12z"/>
      <path d="M1175 1425 c-3 -8 -7 -21 -9 -29 -4 -12 18 -202 29 -253 4 -16 36
      -37 128 -82 67 -34 127 -61 132 -61 6 0 24 -7 40 -16 49 -26 92 -4 185 92 45
      47 80 92 80 103 0 26 -28 41 -77 41 -50 0 -150 24 -243 57 -56 21 -94 44 -155
      95 -82 69 -102 79 -110 53z m121 -180 c-6 -14 -14 -25 -18 -25 -18 0 -38 35
      -38 66 l0 35 34 -26 c30 -23 33 -28 22 -50z m104 -55 c0 -34 -9 -36 -50 -15
      -31 16 -39 42 -19 62 9 9 19 8 40 -3 22 -11 29 -22 29 -44z m101 -3 c22 -10
      25 -16 18 -34 -10 -27 -20 -28 -59 -8 -33 17 -33 17 -24 39 7 19 29 20 65 3z
      m-181 -39 c0 -13 -19 -9 -45 8 -14 9 -23 20 -20 25 6 9 65 -21 65 -33z m329 6
      c3 -3 -6 -16 -20 -30 -20 -20 -32 -24 -52 -19 -27 7 -32 20 -21 50 5 13 15 15
      48 10 22 -4 43 -9 45 -11z m-269 -36 c0 -13 -23 -5 -28 10 -2 7 2 10 12 6 9
      -3 16 -11 16 -16z m77 -14 c3 -8 1 -20 -4 -25 -12 -12 -48 14 -39 29 10 17 36
      15 43 -4z m82 -25 c34 -12 40 -24 15 -33 -26 -10 -64 4 -64 25 0 22 6 23 49 8z"/>
      <path d="M301 2346 c-19 -23 -3 -43 111 -142 110 -95 142 -110 168 -79 17 21
      4 49 -38 81 -20 16 -44 34 -52 41 -153 121 -165 128 -189 99z"/>
      <path d="M2680 2303 c-77 -24 -252 -107 -264 -125 -8 -14 -7 -21 6 -34 26 -26
      59 -20 170 30 57 26 118 54 136 62 24 10 32 20 32 38 0 37 -27 46 -80 29z"/>
      <path d="M87 1853 c-12 -11 -7 -50 7 -62 8 -7 27 -16 43 -21 15 -4 73 -22 128
      -39 84 -27 104 -30 122 -20 54 29 17 71 -88 100 -41 11 -93 27 -117 35 -46 15
      -85 18 -95 7z"/>
      <path d="M2634 1691 c-84 -7 -114 -20 -114 -51 0 -40 21 -43 178 -30 156 13
      182 20 182 48 0 43 -41 48 -246 33z"/>
      <path d="M290 804 c-120 -43 -137 -52 -143 -75 -6 -22 17 -49 41 -49 41 0 233
      74 250 97 16 22 15 28 -4 47 -21 22 -35 20 -144 -20z"/>
      <path d="M2267 789 c-38 -22 -11 -69 65 -112 26 -15 75 -50 110 -78 72 -58
      111 -64 116 -17 4 34 -27 64 -143 143 -96 64 -125 77 -148 64z"/>
      <path d="M677 597 c-68 -71 -164 -183 -176 -205 -10 -18 -10 -27 0 -38 21 -25
      45 -15 99 44 30 31 84 89 121 127 54 57 65 74 58 88 -17 29 -66 21 -102 -16z"/>
      <path d="M1912 518 c-19 -19 -14 -40 22 -101 19 -32 45 -78 58 -103 27 -55 85
      -124 103 -124 17 0 45 27 45 43 0 17 -158 269 -178 285 -20 15 -35 15 -50 0z"/>
      <path d="M1500 395 c-10 -12 -10 -41 -1 -143 13 -135 25 -175 54 -180 39 -8
      50 17 42 101 -3 44 -8 87 -9 96 -2 9 -7 39 -11 66 -4 28 -12 56 -17 63 -14 17
      -43 15 -58 -3z"/>
    </g>
  </svg>
);

interface CartItem extends Product {
  quantity: number;
}

type OrderStatus = 'created' | 'shipped' | 'delivered' | 'received';

interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: string[];
  deliveryNote?: string;
}

interface BonusTransaction {
  id: string;
  type: 'earn' | 'spend' | 'referral';
  amount: number;
  description: string;
  date: string;
}

interface UserProfile {
  name: string;
  fullName?: string;
  birthDate?: string;
  city?: string;
  tgId: string;
  photo: string;
  orderCount: number;
  bonusBalance: number;
  primaryAddress?: string;
  primaryProviderId?: string;
}

const MIN_ORDER_FREE_DELIVERY = 1500;
const PAID_DELIVERY_FEE = 300;

const DELIVERY_PROVIDERS = [
  { id: 'ozon', name: 'Ozon Доставка', color: 'bg-blue-600', icon: <Package size={20} />, query: 'Ozon пункт выдачи' },
  { id: 'wb', name: 'Wildberries', color: 'bg-purple-700', icon: <Store size={20} />, query: 'Wildberries пункт выдачи' },
  { id: 'yandex', name: 'Яндекс Доставка', color: 'bg-yellow-400', icon: <Truck size={20} />, query: 'Яндекс Маркет пункт выдачи' }
];

const YANDEX_MAPS_API_KEY = 'b64caade-ab3a-4c23-9867-a5aa71c3d177';

interface PVZPoint {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  hours?: string;
}

const PVZPickerContent: React.FC<{ 
  providerId: string; 
  city: string; 
  onSelect: (address: string) => void;
  isDarkMode: boolean;
}> = ({ providerId, city, onSelect, isDarkMode }) => {
  const [points, setPoints] = useState<PVZPoint[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.751574, 37.573856]); // Moscow default
  const [mapZoom, setMapZoom] = useState(14);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [canSearchHere, setCanSearchHere] = useState(false);
  const mapRef = useRef<any>(null);

  const ymapsInstance = useYMaps(['suggest', 'geocode', 'search', 'geolocation']) as any;
  const provider = DELIVERY_PROVIDERS.find(p => p.id === providerId);

  // Debounced search effect
  useEffect(() => {
    if (!ymapsInstance || searchQuery.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setIsDropdownVisible(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setIsDropdownVisible(true);
      try {
        console.log('Searching for:', searchQuery);
        
        // Try suggest first if available
        let res: any[] = [];
        if (ymapsInstance && typeof ymapsInstance.suggest === 'function') {
          try {
            // Restrict suggest to Russia if possible by adding it to query or using bounds
            // Russia bounds: [[41.185, 19.485], [81.858, 169.01]]
            res = await ymapsInstance.suggest(searchQuery, {
              boundedBy: [[41.185, 19.485], [81.858, 169.01]],
              results: 7
            });
            console.log('Suggest results:', res);
          } catch (suggestErr) {
            console.warn('Suggest API failed, falling back to geocode:', suggestErr);
          }
        }
        
        if (res && res.length > 0) {
          const mapped = res
            .map(s => ({
              value: s.value || s.displayName || (typeof s === 'string' ? s : ''),
              displayName: s.displayName || s.value || (typeof s === 'string' ? s : '')
            }))
            .filter(s => s.displayName && s.displayName.trim().length > 0);
          
          if (mapped.length > 0) {
            setSuggestions(mapped);
          } else {
            setSuggestions([]);
          }
        } else {
          // Fallback to geocode if suggest returns nothing or is unavailable
          console.log('Falling back to geocode for:', searchQuery);
          const geoRes = await ymapsInstance.geocode(searchQuery, { 
            results: 10,
            boundedBy: [[41.185, 19.485], [81.858, 169.01]],
            strictBounds: false // Prefer Russia but don't be too strict
          });
          const geoSuggestions = geoRes.geoObjects.toArray()
            .map((obj: any) => {
              const name = obj.properties.get('name');
              const description = obj.properties.get('description');
              const text = obj.properties.get('text');
              return {
                value: text || name,
                displayName: (name + (description ? `, ${description}` : '')) || text
              };
            });
            
          console.log('Geocode fallback results:', geoSuggestions);
          setSuggestions(geoSuggestions);
        }
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, ymapsInstance]);

  // Geocode city on load or change
  useEffect(() => {
    if (ymapsInstance && city) {
      ymapsInstance.geocode(city).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const coords = (firstGeoObject.geometry as any).getCoordinates();
          setMapCenter(coords);
          // Also fetch points for this city immediately
          fetchPointsForLocation(city, coords);
        }
      });
    }
  }, [city, ymapsInstance, providerId]);

  const fetchPointsForLocation = async (locationName: string, coords?: [number, number], bounds?: number[][]) => {
    if (!provider || !ymapsInstance) return;
    setLoading(true);
    try {
      const query = provider.query;
      
      const searchOptions: any = {
        results: 100, // Yandex JS API usually limits to 100 per request
        type: 'biz',
        noCentering: true
      };

      if (bounds) {
        searchOptions.boundedBy = bounds;
        searchOptions.strictBounds = true;
      } else if (coords) {
        // Search in a wide area around the coordinates
        searchOptions.boundedBy = [
          [coords[0] - 0.15, coords[1] - 0.2],
          [coords[0] + 0.15, coords[1] + 0.2]
        ];
        searchOptions.strictBounds = false;
      } else {
        searchOptions.boundedBy = [[41.185, 19.485], [81.858, 169.01]]; // Russia bounds
      }

      // If we have specific bounds or coords, the brand query is enough
      // Adding locationName might over-restrict if it's a specific address
      const finalQuery = (bounds || (coords && locationName.length > 15)) ? query : (locationName ? `${query} ${locationName}` : query);
      
      console.log('Fetching PVZ points with query:', finalQuery, 'options:', searchOptions);
      const result = await ymapsInstance.search(finalQuery, searchOptions);

      const newPoints = result.geoObjects.toArray().map((obj: any) => {
        const meta = obj.properties.get('CompanyMetaData');
        return {
          id: meta?.id || Math.random().toString(36).substr(2, 9),
          name: obj.properties.get('name'),
          address: meta?.address || obj.properties.get('description') || obj.properties.get('text'),
          coordinates: obj.geometry.getCoordinates()
        };
      });

      // If we are searching in a new area, we might want to append or replace
      // For simplicity and to avoid duplicates, we replace for now but could merge
      setPoints(newPoints);
      
      if (coords && !bounds) {
        setMapCenter(coords);
      } else if (!bounds && newPoints.length > 0) {
        setMapCenter(newPoints[0].coordinates);
      }
    } catch (err) {
      console.error('Failed to fetch PVZ points:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      setIsDropdownVisible(true);
    }
  };

  const handleSelectSuggestion = async (suggestion: any) => {
    const value = suggestion.displayName || suggestion.value;
    setSearchQuery(value);
    setSuggestions([]);
    setIsDropdownVisible(false);
    if (ymapsInstance) {
      try {
        const res = await ymapsInstance.geocode(suggestion.value);
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const coords = (firstGeoObject.geometry as any).getCoordinates();
          setMapCenter(coords);
          // Search for PVZ in this new location
          fetchPointsForLocation(suggestion.value, coords);
        }
      } catch (err) {
        console.error('Geocode error:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery) {
      handleSelectSuggestion({ value: searchQuery, displayName: searchQuery });
    }
  };

  const handleGeolocation = () => {
    if (ymapsInstance && ymapsInstance.geolocation) {
      setLoading(true);
      ymapsInstance.geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
      }).then((result: any) => {
        const coords = result.geoObjects.get(0).geometry.getCoordinates();
        setMapCenter(coords);
        setMapZoom(16);
        setUserLocation(coords);
        setLoading(false);
        
        ymapsInstance.geocode(coords).then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);
          if (firstGeoObject) {
            // Extract city or locality for a broader search
            const city = firstGeoObject.getLocalities()?.[0] || 
                         firstGeoObject.getAdministrativeAreas()?.[0] || 
                         firstGeoObject.properties.get('name');
            fetchPointsForLocation(city || firstGeoObject.properties.get('text'), coords);
          }
        });
      }).catch((err: any) => {
        setLoading(false);
        console.error("Yandex Geolocation error:", err);
        // Fallback to browser geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
              setMapCenter(coords);
              setMapZoom(16);
              setUserLocation(coords);
              ymapsInstance.geocode(coords).then((res: any) => {
                const firstGeoObject = res.geoObjects.get(0);
                if (firstGeoObject) {
                  const city = firstGeoObject.getLocalities()?.[0] || 
                               firstGeoObject.getAdministrativeAreas()?.[0] || 
                               firstGeoObject.properties.get('name');
                  fetchPointsForLocation(city || firstGeoObject.properties.get('text'), coords);
                }
              });
            },
            (err) => console.error("Browser Geolocation fallback error:", err),
            { enableHighAccuracy: true }
          );
        }
      });
    } else if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setMapCenter(coords);
          setMapZoom(16); // Zoom in for better "calibration"
          setUserLocation(coords);
          setLoading(false);
          
          if (ymapsInstance) {
            ymapsInstance.geocode(coords).then((res: any) => {
              const firstGeoObject = res.geoObjects.get(0);
              if (firstGeoObject) {
                const city = firstGeoObject.getLocalities()?.[0] || 
                             firstGeoObject.getAdministrativeAreas()?.[0] || 
                               firstGeoObject.properties.get('name');
                fetchPointsForLocation(city || firstGeoObject.properties.get('text'), coords);
              }
            });
          }
        },
        (error) => {
          setLoading(false);
          console.error("Geolocation error:", error);
          // Fallback or alert could be added here if needed
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn h-full overflow-y-auto pr-2 scrollbar-hide">
      <button 
        onClick={() => setShowMapModal(true)}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-dashed transition-all active:scale-95 shrink-0 ${
          isDarkMode ? 'border-pink-500/40 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' : 'border-pink-300 bg-pink-100/50 text-pink-600 hover:bg-pink-100'
        }`}
      >
        <MapPin size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Выбрать на карте</span>
      </button>

      <div className="relative z-[60]">
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <Search size={16} className="text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Поиск города, улицы или адреса..."
            className={`flex-1 bg-transparent text-[11px] font-bold focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          />
        </div>
        
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {(isDropdownVisible && (suggestions.length > 0 || (searchQuery.length >= 2 && !isSearching && suggestions.length === 0))) && (
          <div className={`absolute top-full left-0 right-0 mt-2 z-[70] rounded-2xl border shadow-2xl overflow-hidden animate-slideDown ${isDarkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-100'}`}>
            {suggestions.length > 0 ? (
              suggestions.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSelectSuggestion(s)}
                  className={`w-full px-5 py-3.5 text-left text-[10px] font-bold border-b last:border-0 transition-colors ${
                    isDarkMode ? 'border-white/5 hover:bg-white/10 text-white' : 'border-gray-50 hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  {s.displayName || 'Без названия'}
                </button>
              ))
            ) : (
              <div className={`px-5 py-4 text-[10px] font-bold text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Ничего не найдено
              </div>
            )}
          </div>
        )}
      </div>

      {showMapModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black animate-fadeIn">
          <div className="flex-1 relative">
            {loading && (
              <div className={`absolute inset-0 z-20 flex items-center justify-center ${isDarkMode ? 'bg-black/30' : 'bg-white/30'} backdrop-blur-sm`}>
                <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              </div>
            )}
            
            <Map 
              instanceRef={mapRef}
              state={{ center: mapCenter, zoom: mapZoom, controls: [] }} 
              width="100%" 
              height="100%"
              modules={['search', 'geocode', 'suggest', 'util.bounds', 'geolocation']}
              options={{
                suppressMapOpenBlock: true,
                yandexMapDisablePoiInteractivity: true
              }}
              onBoundsChange={() => {
                setCanSearchHere(true);
              }}
            >
              {userLocation && (
                <Placemark 
                  geometry={userLocation}
                  options={{
                    preset: 'islands#geolocationIcon',
                    iconColor: '#3b82f6'
                  }}
                />
              )}
              {points.map(p => (
                <Placemark 
                  key={p.id}
                  geometry={p.coordinates}
                  properties={{
                    balloonContentHeader: `<div style="font-weight: bold; font-size: 14px; color: #ec4899;">${p.name}</div>`,
                    balloonContentBody: `
                      <div style="font-family: sans-serif; padding: 2px; min-width: 180px;">
                        <p style="font-size: 12px; font-weight: bold; margin: 5px 0; color: #374151;">${p.address}</p>
                        <button id="select-pvz-${p.id}" style="width: 100%; background: #ec4899; color: white; border: none; padding: 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer; text-transform: uppercase;">ВЫБРАТЬ</button>
                      </div>
                    `,
                  }}
                  options={{
                    preset: 'islands#pinkDotIconWithCaption',
                    iconColor: '#ec4899',
                  }}
                  onBalloonOpen={() => {
                    setTimeout(() => {
                      const btn = document.getElementById(`select-pvz-${p.id}`);
                      if (btn) {
                        btn.onclick = () => {
                          setSelectedPointId(p.id);
                          onSelect(`${p.name}: ${p.address}`);
                          setShowMapModal(false);
                          setIsDropdownVisible(false);
                          setSuggestions([]);
                        };
                      }
                    }, 100);
                  }}
                />
              ))}
            </Map>

            {/* Search in this area button */}
            {canSearchHere && (
              <div className="absolute top-20 left-0 right-0 z-[110] flex justify-center pointer-events-none animate-fadeIn">
                <button 
                  onClick={() => {
                    if (mapRef.current) {
                      const bounds = mapRef.current.getBounds();
                      fetchPointsForLocation('', undefined, bounds);
                      setCanSearchHere(false);
                    }
                  }}
                  className={`pointer-events-auto px-6 py-3 rounded-full shadow-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                    isDarkMode ? 'bg-pink-500 text-white' : 'bg-white text-pink-600 border border-pink-100'
                  }`}
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Искать в этой области
                </button>
              </div>
            )}

            {/* Geolocation Button */}
            <button 
              onClick={handleGeolocation}
              className={`absolute bottom-24 right-4 z-[110] p-4 rounded-2xl shadow-2xl active:scale-95 transition-all ${isDarkMode ? 'bg-gray-900 text-pink-500' : 'bg-white text-pink-500'}`}
            >
              <Navigation size={24} />
            </button>

            {/* Bottom Panel with Search and Back Button */}
            <div className="absolute bottom-0 left-0 right-0 z-[110] p-4 flex items-center gap-3 pointer-events-none animate-slideUp">
              <button 
                onClick={() => {
                  setShowMapModal(false);
                  setIsDropdownVisible(false);
                  setSuggestions([]);
                }} 
                className={`w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-95 transition-all ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
              >
                <ChevronLeft size={28} />
              </button>
              
              <div className={`flex-1 h-14 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center px-5 gap-4 pointer-events-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <Search size={20} className="text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectSuggestion({ value: searchQuery, displayName: searchQuery });
                  }}
                  placeholder="Поиск адреса..."
                  className={`flex-1 bg-transparent text-[13px] font-bold focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="space-y-2">
        {points.length === 0 && !loading ? (
          <p className="text-center py-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Пункты не найдены</p>
        ) : (
          points.map(p => (
            <button 
              key={p.id}
              onClick={() => {
                setSelectedPointId(p.id);
                setMapCenter(p.coordinates);
                onSelect(`${p.name}: ${p.address}`);
                setIsDropdownVisible(false);
                setSuggestions([]);
              }}
              className={`w-full p-4 rounded-2xl text-left border transition-all ${
                selectedPointId === p.id 
                  ? 'border-pink-500 bg-pink-50/20' 
                  : isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-50 bg-white'
              }`}
            >
              <p className={`text-[11px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
              <p className="text-[9px] text-gray-400 font-bold mt-1">{p.address}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const PVZPicker: React.FC<{ 
  providerId: string; 
  city: string; 
  onSelect: (address: string) => void;
  isDarkMode: boolean;
}> = (props) => {
  return <PVZPickerContent {...props} />;
};

const ORDER_STATUSES_META: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  created: { label: 'Принят', icon: <Check size={12} />, color: 'text-blue-500', bgColor: 'bg-blue-500' },
  shipped: { label: 'В пути', icon: <Truck size={12} />, color: 'text-amber-500', bgColor: 'bg-amber-500' },
  delivered: { label: 'В ПВЗ', icon: <MapPin size={12} />, color: 'text-green-500', bgColor: 'bg-green-500' },
  received: { label: 'Дома', icon: <Home size={12} />, color: 'text-gray-400', bgColor: 'bg-gray-400' },
};

const App: React.FC = () => {
  return (
    <YMaps query={{ 
      apikey: YANDEX_MAPS_API_KEY, 
      lang: 'ru_RU', 
      load: 'package.full,suggest,geocode',
      ns: 'ymaps'
    }}>
      <AppContent />
    </YMaps>
  );
};

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Capture referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editCity, setEditCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [makePrimary, setMakePrimary] = useState(false);
  const [orderComment, setOrderComment] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('sbp');
  const [payAfterReceipt, setPayAfterReceipt] = useState(false);
  const [bonusToSpend, setBonusToSpend] = useState(0);
  const [useBonuses, setUseBonuses] = useState(false);

  const [activeTab, setActiveTab] = useState<'shop' | 'zen' | 'profile'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTip, setSelectedTip] = useState<RelaxTip | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [aiInput, setAiInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // All sections collapsed by default
  const [isAffiliateExpanded, setIsAffiliateExpanded] = useState(false);
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);
  const [isBonusHistoryExpanded, setIsBonusHistoryExpanded] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme logic
  useEffect(() => {
    const checkTheme = () => {
      try {
        // Moscow is UTC+3
        const moscowTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" });
        const hours = new Date(moscowTime).getHours();
        const isNight = hours >= 20 || hours < 6;
        
        const savedTheme = localStorage.getItem('theme');
        const lastAutoTheme = localStorage.getItem('last_auto_theme');
        
        // If the "night/day" state changed since last auto check, force it
        if (lastAutoTheme !== (isNight ? 'night' : 'day')) {
          setIsDarkMode(isNight);
          localStorage.setItem('last_auto_theme', isNight ? 'night' : 'day');
          localStorage.setItem('theme', isNight ? 'dark' : 'light');
        } else if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          setIsDarkMode(isNight);
        }
      } catch (err) {
        console.error('Failed to check theme:', err);
      }
    };

    checkTheme();
    const interval = setInterval(checkTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const [bonusTransactions] = useState<BonusTransaction[]>([
    { id: 'bt1', type: 'earn', amount: 50, description: 'Кэшбэк за заказ #12401', date: '24.05.2024' },
    { id: 'bt2', type: 'referral', amount: 120, description: 'Бонус за приглашение друга', date: '20.05.2024' },
    { id: 'bt3', type: 'spend', amount: 200, description: 'Оплата баллами заказа #11982', date: '12.04.2024' },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const cityInputRef = useRef<HTMLDivElement>(null);

  const filteredProducts = selectedCategory === 'Все' ? products : products.filter(p => p.category === selectedCategory);
  const filteredCities = RUSSIA_CITIES.filter(city => city.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 5);
  const categories = ['Все', ...Object.values(Category)];
  const referralLink = isLoggedIn && currentUser ? `${window.location.origin}?ref=${currentUser.id}` : "Войдите, чтобы получить ссылку";
  const affiliateStats = {
    balance: 840,
    levels: [
      { id: 1, name: '1 Уровень', percent: 5, count: 8, earned: 520, icon: <Zap size={14} /> },
      { id: 2, name: '2 Уровень', percent: 3, count: 14, earned: 210, icon: <Target size={14} /> },
      { id: 3, name: '3 Уровень', percent: 2, count: 32, earned: 110, icon: <Award size={14} /> }
    ]
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isAiLoading]);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          setCurrentUser(data.user);
          setIsLoggedIn(true);
          setEditName(data.user.name);
          fetchOrders();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
    fetchProducts();

    // Check for admin path
    if (window.location.pathname === '/admin-secret-9922') {
      setIsAdmin(true);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // Listen for OAuth success message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        // Refresh user data
        fetch('/api/auth/me')
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then(data => {
            if (data.user) {
              setCurrentUser(data.user);
              setIsLoggedIn(true);
              setEditName(data.user.name);
            }
          })
          .catch(err => console.error('Failed to fetch user after OAuth:', err))
          .finally(() => setIsAuthenticating(false));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      // Redirect to Auth.js VK sign-in
      window.location.href = "/api/auth/signin/vk";
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call Auth.js signout first
      await fetch('/api/auth/signout', { method: 'POST', body: new URLSearchParams({ csrf: 'true' }) });
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setCurrentUser(null);
      setActiveTab('shop');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = cartTotal >= MIN_ORDER_FREE_DELIVERY ? 0 : PAID_DELIVERY_FEE;
  
  const maxBonusAllowed = Math.floor(cartTotal * 0.99);
  const bonusToApply = useBonuses ? Math.min(bonusToSpend, maxBonusAllowed, currentUser?.bonusBalance || 0) : 0;
  const finalTotal = cartTotal + deliveryFee - bonusToApply;

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    setChatHistory(prev => [...prev, { role: 'user', text: aiInput }]);
    const input = aiInput; setAiInput(''); setIsAiLoading(true);
    const botResponse = await getRecommendation(input);
    setChatHistory(prev => [...prev, { role: 'model', text: botResponse || '' }]);
    setIsAiLoading(false);
  };

  const confirmReceipt = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'received', deliveryNote: undefined } : o));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleFeedbackRedirect = () => {
    window.open('https://t.me/tsvetastiy_feedback', '_blank');
  };

  // Checkout Logic
  const startCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
    setSelectedProvider(null);
    setDeliveryAddress('');
    setUseBonuses(false);
    setBonusToSpend(0);
  };

  const handleProviderSelect = (id: string) => {
    setSelectedProvider(id);
    setCheckoutStep(2);
    // Pre-fill primary address if it exists for this provider
    if (currentUser?.primaryProviderId === id && currentUser?.primaryAddress) {
      setDeliveryAddress(currentUser.primaryAddress);
      setMakePrimary(true);
    } else {
      setDeliveryAddress('');
      setMakePrimary(false);
    }
  };

  const finishCheckout = async () => {
    const newOrderData = {
      total: finalTotal,
      items: cart.map(i => i.name),
      deliveryAddress: `${citySearch}, ${deliveryAddress}`,
      deliveryProvider: selectedProvider,
      comment: orderComment
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderData)
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        
        // Update user balance if bonuses were used
        const bonusToApply = useBonuses ? bonusToSpend : 0;
        if (bonusToApply > 0) {
          const updatedUser = {
            ...currentUser!,
            bonusBalance: (currentUser?.bonusBalance || 0) - bonusToApply
          };
          setCurrentUser(updatedUser);
        }
        
        // Update primary address if requested
        if (makePrimary && selectedProvider) {
          const updatedUser = { 
            ...currentUser!, 
            primaryAddress: deliveryAddress, 
            primaryProviderId: selectedProvider 
          };
          setCurrentUser(updatedUser);
          // In a real app, we'd also send this to the server
          await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ primaryAddress: deliveryAddress, primaryProviderId: selectedProvider })
          });
        }

        setIsCheckoutOpen(false);
        setCart([]);
        setOrderComment('');
        setActiveTab('profile');
        setIsOrdersExpanded(true);
      }
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  // --- UI HELPERS ---
  const AccordionHeader = ({ isOpen, onToggle, icon, title, subtitle }: any) => (
    <button onClick={onToggle} className={`w-full p-5 flex items-center justify-between transition-colors ${isOpen ? 'bg-gray-50/50' : 'bg-white'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOpen ? 'bg-white shadow-sm' : 'bg-gray-50'} text-gray-500`}>{icon}</div>
        <div className="text-left">
          <h3 className="text-[12px] font-black uppercase tracking-tight text-gray-900 leading-none">{title}</h3>
          {subtitle && <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mt-1.5">{subtitle}</p>}
        </div>
      </div>
      <div className={`p-1 bg-gray-50 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDown size={16} className="text-gray-300" /></div>
    </button>
  );

  if (isAdmin) {
    return <AdminPanel />;
  }

  if (isAuthChecking) {
    return (
      <div className={`flex flex-col min-h-screen max-w-md mx-auto items-center justify-center font-['Montserrat'] transition-colors duration-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`w-16 h-16 border-4 rounded-full animate-spin ${isDarkMode ? 'border-pink-900 border-t-pink-500' : 'border-pink-200 border-t-pink-500'}`}></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className={`flex flex-col min-h-screen max-w-md mx-auto items-center justify-center px-10 text-center font-['Montserrat'] transition-colors duration-500 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="mb-8 w-24 h-24 flex items-center justify-center animate-float-slow">
          <SunLogo className={`w-24 h-24 -mt-[13px] -mb-[33px] ${isDarkMode ? 'text-white' : 'text-black'}`} />
        </div>
        <TextLogo className={`h-[58px] -mb-[3px] ${isDarkMode ? 'text-white' : 'text-black'}`} />

        <p className={`text-[10px] font-bold tracking-[0.4em] uppercase mb-[106px] ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`}>Мастерская релакса</p>
        
        <div className="w-full max-w-[240px] mx-auto space-y-4">
          <button 
            onClick={handleLogin} 
            disabled={isAuthenticating} 
            className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-600'} font-black py-4 rounded-[32px] shadow-lg flex items-center justify-center gap-4 active:scale-95 transition-all uppercase text-[10px] tracking-[0.2em]`}
          >
            {isAuthenticating ? "Вход..." : "Войти через ВК"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen max-w-md mx-auto shadow-2xl overflow-hidden relative pb-20 font-['Montserrat'] transition-colors duration-500 ${isDarkMode ? 'dark bg-[#121212] text-white' : 'bg-white text-gray-900'}`}>
      <header className={`px-6 pt-8 pb-1 sticky top-0 z-10 transition-colors duration-500 ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 cursor-pointer transition-all duration-500 ${activeTab === 'profile' ? 'w-full justify-center' : ''}`} onClick={() => setActiveTab('shop')}>
            <TextLogo className={`h-10 w-auto aspect-[930/208] ${isDarkMode ? 'text-white' : 'text-black'}`} />
          </div>
          
          {/* User Profile Widget */}
          {currentUser && activeTab !== 'profile' && (
            <div 
              onClick={() => setActiveTab('profile')}
              className="relative cursor-pointer group active:scale-95 transition-all flex items-center justify-center"
            >
              <div className={`w-12 h-12 rounded-full p-0.5 border transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 group-hover:border-pink-500' : 'bg-white border-gray-100 shadow-sm group-hover:border-pink-200'}`}>
                <img 
                  src={currentUser.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop"} 
                  className="w-full h-full object-cover rounded-full" 
                  alt="Avatar" 
                />
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#5D5FEF] text-white text-[8px] font-black px-2 h-4 rounded-full flex items-center gap-1 shadow-lg border border-white/20 whitespace-nowrap">
                <span>{currentUser.bonusBalance || 0}</span>
                <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center">
                  <Coins size={7} className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'shop' && (
          <div className="animate-fadeIn px-4 py-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-gray-50 text-gray-400'}`}>{cat}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {filteredProducts.map(product => (
                <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white rounded-[32px] p-3 shadow-sm border border-gray-100 flex flex-col gap-3 active:scale-95 transition-transform group">
                  <div className="aspect-square rounded-[24px] overflow-hidden bg-gray-50 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[15px] font-black text-pink-500">{product.price} ₽</span>
                      <div onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-md"><Plus size={16} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'zen' && (
          <div className="flex flex-col h-[75vh] animate-fadeIn">
            <div className="px-4 py-6">
              <h2 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Советы Дзен</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {RELAX_TIPS.map(tip => (
                  <div key={tip.id} onClick={() => setSelectedTip(tip)} className="min-w-[220px] bg-white border border-green-50 p-4 rounded-[28px] shadow-sm flex gap-3 items-center active:scale-95 transition-transform">
                    <div className="text-2xl bg-green-50 w-10 h-10 flex items-center justify-center rounded-xl shrink-0">{tip.icon}</div>
                    <h3 className="text-[11px] font-black text-gray-900 leading-tight">{tip.title}</h3>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
               <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Муза Релакса</h3>
               <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                 {chatHistory.length === 0 && <p className="text-xs text-center text-gray-300 pt-10 px-8 leading-loose uppercase tracking-widest">Расскажи о своем дне, и я подберу твой идеальный вечер ✨</p>}
                 {chatHistory.map((msg, i) => (
                   <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] px-4 py-3 rounded-[20px] text-[12px] font-medium ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100'}`}>{msg.text}</div>
                   </div>
                 ))}
                 {isAiLoading && <div className="flex items-center gap-1.5 p-3 bg-gray-50 rounded-2xl w-max"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75"></div><div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150"></div></div>}
               </div>
               <div className="mt-4 flex gap-2 p-1.5 bg-white rounded-full border border-gray-100 shadow-xl items-center">
                  <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiSend()} placeholder="Напиши что-нибудь..." className="flex-1 bg-transparent px-4 text-xs focus:outline-none" />
                  <button onClick={handleAiSend} className="bg-blue-500 text-white p-3 rounded-full shadow-lg active:scale-90 transition-all"><Send size={18} /></button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 pb-20 px-4 py-6">
            {/* Header User */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-gradient-to-tr from-pink-300 to-amber-200 rounded-[24px] p-0.5 shadow-md"><img src={currentUser?.photo} className="w-full h-full object-cover rounded-[22px]" alt="Avatar" /></div>
              <div className="flex-1">
                 <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">{currentUser?.name}</h2>
                 <p className="text-pink-500 text-[9px] font-black uppercase tracking-widest mt-1 opacity-70">{currentUser?.tgId}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={toggleTheme} className={`p-2.5 rounded-xl relative active:scale-90 transition-all ${isDarkMode ? 'bg-gray-800 text-amber-400' : 'bg-pink-50 text-pink-500'}`}>
                   {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => setIsEditingProfile(true)} className="p-2.5 bg-gray-50 rounded-xl text-gray-400 active:scale-90 transition-all"><Edit3 size={18} /></button>
              </div>
            </div>

            {/* Compact Stats */}
            <div className="flex gap-3 justify-center">
               <div className="bg-white px-5 py-3 rounded-[24px] border border-gray-50 flex flex-col items-center flex-1">
                  <span className="text-lg font-black text-gray-900 leading-none">{orders.length}</span>
                  <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-1">Заказов</span>
               </div>
               <div className="bg-white px-5 py-3 rounded-[24px] border border-gray-50 flex flex-col items-center flex-1">
                  <span className="text-lg font-black text-gray-900 leading-none">{currentUser?.bonusBalance || 0}</span>
                  <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-1">Баллов</span>
               </div>
            </div>

            {/* Sections Accordion */}
            <div className="space-y-2.5">
              <div className="bg-white rounded-[28px] border border-gray-50 shadow-sm overflow-hidden">
                <AccordionHeader 
                  isOpen={isOrdersExpanded} 
                  onToggle={() => setIsOrdersExpanded(!isOrdersExpanded)} 
                  icon={<Layers size={18} />} 
                  title="Мои заказы" 
                  subtitle="Где твой релакс?" 
                />
                {isOrdersExpanded && (
                  <div className="p-4 space-y-4 animate-fadeIn border-t border-gray-50 bg-gray-50/20">
                    {orders.length === 0 ? <p className="text-center py-4 text-[9px] font-black uppercase text-gray-400">Нет заказов</p> : orders.map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-[24px] border border-gray-50 shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">#{order.id}</p>
                              <p className="text-[11px] font-bold text-gray-900">{order.date}</p>
                           </div>
                           <p className="text-[11px] font-black text-gray-900">{order.total} ₽</p>
                        </div>
                        <div className="space-y-3 px-1 mb-4">
                           <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${ORDER_STATUSES_META[order.status].bgColor}`} style={{ width: order.status === 'created' ? '25%' : order.status === 'shipped' ? '50%' : order.status === 'delivered' ? '75%' : '100%' }}></div>
                           </div>
                           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-400">
                              {['created', 'shipped', 'delivered', 'received'].map((s: any) => (
                                <span key={s} className={`transition-colors duration-500 ${order.status === s ? ORDER_STATUSES_META[s].color : ''}`}>
                                  {ORDER_STATUSES_META[s].label}
                                </span>
                              ))}
                           </div>
                        </div>
                        {order.deliveryNote && <div className="text-[9px] text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100 font-bold leading-relaxed italic mb-3">"{order.deliveryNote}"</div>}
                        <div className="flex gap-2">
                           {order.status === 'delivered' && (
                             <button onClick={() => confirmReceipt(order.id)} className="flex-1 bg-green-500 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95"><ThumbsUp size={14} /> Получил</button>
                           )}
                           {order.status === 'received' && (
                             <button onClick={handleFeedbackRedirect} className="flex-1 bg-gray-900 text-white font-black py-3 rounded-xl text-[9px] uppercase tracking-[0.1em] flex items-center justify-center gap-2"><MessageSquare size={14} /> Отзыв</button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[28px] border border-gray-50 shadow-sm overflow-hidden">
                <AccordionHeader 
                  isOpen={isBonusHistoryExpanded} 
                  onToggle={() => setIsBonusHistoryExpanded(!isBonusHistoryExpanded)} 
                  icon={<Coins size={18} />} 
                  title="История бонусов" 
                  subtitle="Накопления" 
                />
                {isBonusHistoryExpanded && (
                  <div className="p-4 space-y-2.5 animate-fadeIn border-t border-gray-50 bg-gray-50/20">
                    {bonusTransactions.map(bt => (
                      <div key={bt.id} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-50">
                        <div className="flex items-center gap-3">
                           <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bt.type === 'spend' ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>{bt.type === 'spend' ? <Repeat size={14} /> : <TrendingUp size={14} />}</div>
                           <div><p className="text-[10px] font-bold text-gray-900">{bt.description}</p><p className="text-[8px] text-gray-400 font-medium">{bt.date}</p></div>
                        </div>
                        <p className={`text-[11px] font-black ${bt.type === 'spend' ? 'text-red-400' : 'text-green-500'}`}>{bt.type === 'spend' ? '-' : '+'}{bt.amount}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[28px] border border-gray-50 shadow-sm overflow-hidden">
                <AccordionHeader 
                  isOpen={isAffiliateExpanded} 
                  onToggle={() => setIsAffiliateExpanded(!isAffiliateExpanded)} 
                  icon={<HeartHandshake size={18} />} 
                  title="Дарите релакс" 
                  subtitle="Зарабатывайте баллы" 
                />
                {isAffiliateExpanded && (
                  <div className="p-5 space-y-6 animate-fadeIn border-t border-gray-50 bg-white">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[28px] p-6 text-white relative overflow-hidden shadow-xl">
                       <h4 className="text-[12px] font-black uppercase tracking-widest mb-4 opacity-90">Твоя ссылка</h4>
                       <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 pl-4 border border-white/20">
                          <span className="truncate text-[9px] font-mono flex-1 opacity-80">{referralLink}</span>
                          <button onClick={copyToClipboard} className={`p-3 rounded-xl transition-all ${copySuccess ? 'bg-green-500' : 'bg-white text-indigo-600 shadow-md active:scale-90'}`}>{copySuccess ? <Check size={16} /> : <Copy size={16} />}</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                       {affiliateStats.levels.map(level => (
                         <div key={level.id} className="bg-gray-50/50 rounded-2xl p-4 flex items-center justify-between border border-gray-100 group">
                            <div className="flex items-center gap-4">
                               <div className="w-9 h-9 bg-white text-indigo-400 rounded-xl flex items-center justify-center shadow-sm">{level.icon}</div>
                               <div><p className="text-[11px] font-black uppercase">{level.name}</p><p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{level.count} друзей</p></div>
                            </div>
                            <div className="text-right"><p className="text-[12px] font-black text-indigo-600">+{level.percent}%</p><p className="text-[7px] text-gray-400 font-bold uppercase">с чека</p></div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleLogout} className="w-full bg-red-50 text-red-400 font-black py-5 rounded-[28px] uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"><LogOut size={16} /> Выйти</button>
          </div>
        )}
      </main>

      {/* Shared Modals */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] p-8 animate-slideUp relative shadow-2xl">
             <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full"><X size={20} /></button>
             <div className="w-52 h-52 mx-auto rounded-[40px] overflow-hidden shadow-2xl mb-8 -mt-16 bg-white p-1 border-4 border-white"><img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover rounded-[36px]" /></div>
             <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{selectedProduct.name}</h3>
             <p className="text-xs text-gray-500 leading-relaxed mb-6 font-medium">{selectedProduct.description}</p>
             
             {selectedProduct.benefits && selectedProduct.benefits.length > 0 && (
               <div className="mb-8 animate-fadeIn">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Преимущества</h4>
                 <div className="flex flex-wrap gap-2">
                   {selectedProduct.benefits.map((benefit, idx) => (
                     <div 
                       key={idx} 
                       className="px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-wider flex items-center gap-2 border border-gray-100 bg-gray-50 text-gray-600 transition-all hover:scale-105"
                     >
                       <Sparkles size={10} className="text-pink-500" />
                       {benefit}
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <div className="flex gap-4 items-center">
               <div className="flex-1 text-2xl font-black text-gray-900">{selectedProduct.price} ₽</div>
               <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="flex-[2] bg-gray-900 text-white font-black py-5 rounded-[24px] shadow-2xl uppercase text-[11px] tracking-[0.2em] active:scale-95 transition-transform">В корзину</button>
             </div>
          </div>
        </div>
      )}

      {selectedTip && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] p-8 animate-slideUp relative text-center shadow-2xl pb-12">
             <button onClick={() => setSelectedTip(null)} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full"><X size={20} /></button>
             <div className="text-6xl mb-6 -mt-16">{selectedTip.icon}</div>
             <h3 className="text-2xl font-black text-gray-900 uppercase mb-4">{selectedTip.title}</h3>
             <p className="text-sm text-gray-600 font-medium italic mb-8">"{selectedTip.content}"</p>
             <button onClick={() => setSelectedTip(null)} className="w-full bg-green-500 text-white font-black py-5 rounded-[24px] shadow-xl uppercase text-xs tracking-widest">Понятно</button>
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md h-full flex flex-col animate-slideUp">
            <header className="p-6 flex items-center justify-between border-b border-gray-50">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white"><ShoppingBag size={20} /></div>
                  <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Корзина</h2>
               </div>
               <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-50 rounded-full"><X size={20} /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {cart.length === 0 ? <p className="text-center py-20 text-gray-300 font-black uppercase tracking-widest text-xs">Корзина пуста</p> : (
                 <>
                   {cartTotal < MIN_ORDER_FREE_DELIVERY && (
                     <div className="bg-amber-50 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-bold text-amber-700 uppercase leading-tight animate-fadeIn">
                        <Info size={16} className="text-amber-800 shrink-0" />
                        <span>Добавьте еще на {MIN_ORDER_FREE_DELIVERY - cartTotal} ₽ для бесплатной доставки!</span>
                     </div>
                   )}
                   {cart.map(item => (
                     <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-[28px] border border-gray-50 shadow-sm">
                        <img src={item.image} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                        <div className="flex-1">
                           <h4 className="text-xs font-black text-gray-900">{item.name}</h4>
                           <p className="text-[10px] font-black text-pink-500 mt-1">{item.price} ₽</p>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full">
                           <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400"><Minus size={14} /></button>
                           <span className="text-[11px] font-black">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400"><Plus size={14} /></button>
                        </div>
                     </div>
                   ))}
                 </>
               )}
            </div>
            {cart.length > 0 && (
              <div className="p-8 bg-white border-t border-gray-50 space-y-6 shadow-xl">
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400"><span>Товары</span><span>{cartTotal} ₽</span></div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400"><span>Доставка</span><span className={deliveryFee === 0 ? 'text-green-500' : 'text-gray-900'}>{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}</span></div>
                </div>
                <div className="flex justify-between items-end">
                   <div><p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Итого</p><p className="text-3xl font-black text-gray-900">{finalTotal} ₽</p></div>
                   <button onClick={startCheckout} className="bg-gray-900 text-white font-black py-5 px-10 rounded-[24px] uppercase text-[10px] tracking-widest active:scale-95 shadow-2xl">Оформить</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[70] flex justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
           <div className="bg-white w-full max-w-md h-full flex flex-col animate-slideUp">
              <header className="p-6 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white"><Truck size={20} /></div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Доставка</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Шаг {checkoutStep} из 3</p>
                      {checkoutStep === 1 && (
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 opacity-60">Бесплатно от {MIN_ORDER_FREE_DELIVERY} ₽ • Иначе {PAID_DELIVERY_FEE} ₽</p>
                      )}
                    </div>
                 </div>
                 <button onClick={() => setIsCheckoutOpen(false)} className="p-2 bg-gray-50 rounded-full active:scale-90 transition-transform"><X size={20} /></button>
              </header>
              
              <div className="flex-1 overflow-y-auto p-8">
                 {checkoutStep === 1 && (
                   <div className="space-y-8 animate-fadeIn">
                      <div className="text-center">
                         <h3 className="text-sm font-black text-gray-900 uppercase mb-2">Выберите службу</h3>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Доставляем по всей России</p>
                      </div>
                      <div className="space-y-4">
                         {DELIVERY_PROVIDERS.map(p => (
                           <button 
                             key={p.id}
                             onClick={() => handleProviderSelect(p.id)}
                             className={`w-full p-6 rounded-[32px] flex items-center justify-between border-2 transition-all active:scale-[0.98] ${
                               selectedProvider === p.id ? 'border-pink-500 bg-pink-50/20' : 'border-gray-50 bg-white'
                             }`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 ${p.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>{p.icon}</div>
                                 <p className="text-xs font-black text-gray-900 uppercase tracking-tight text-left">{p.name}</p>
                              </div>
                              <ChevronRight size={20} className="text-gray-300" />
                           </button>
                         ))}
                      </div>
                   </div>
                 )}

                 {checkoutStep === 2 && (
                    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
                       <div className="text-center shrink-0">
                          <h3 className={`text-sm font-black uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Выберите пункт выдачи</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {DELIVERY_PROVIDERS.find(p => p.id === selectedProvider)?.name} • {currentUser?.city || 'Ваш город'}
                          </p>
                       </div>
                       
                       <div className="flex-1 min-h-0">
                         <PVZPicker 
                           providerId={selectedProvider || ''} 
                           city={currentUser?.city || 'Москва'} 
                           onSelect={(address) => setDeliveryAddress(address)}
                           isDarkMode={isDarkMode}
                         />
                       </div>

                       <div className="space-y-4 shrink-0 pt-4">
                          {deliveryAddress && (
                            <div className={`p-4 rounded-2xl border animate-fadeIn ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-pink-50/30 border-pink-100'}`}>
                               <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Выбранный адрес:</p>
                               <p className={`text-[11px] font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{deliveryAddress}</p>
                            </div>
                          )}
                          
                          {deliveryAddress && (
                            <button 
                              onClick={() => setMakePrimary(!makePrimary)}
                              className="flex items-center gap-3 px-2 group"
                            >
                              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                                makePrimary 
                                  ? 'bg-pink-500 border-pink-500 text-white' 
                                  : isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
                              }`}>
                                {makePrimary && <Check size={12} />}
                              </div>
                              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                makePrimary ? 'text-pink-500' : 'text-gray-400 group-hover:text-gray-500'
                              }`}>Сделать основным</span>
                            </button>
                          )}
                          
                          <div className="flex gap-3">
                            <button 
                              onClick={() => setCheckoutStep(1)}
                              className={`flex-1 py-5 rounded-[24px] uppercase text-[10px] font-black tracking-widest transition-all ${
                                isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-400'
                              }`}
                            >Назад</button>
                            <button 
                              disabled={!deliveryAddress}
                              onClick={() => setCheckoutStep(3)}
                              className={`flex-[2] py-5 rounded-[24px] uppercase text-[10px] font-black tracking-widest shadow-xl transition-all disabled:opacity-50 ${
                                isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'
                              }`}
                            >Далее</button>
                          </div>
                       </div>
                    </div>
                 )}

                 {checkoutStep === 3 && (
                    <div className="space-y-6 animate-fadeIn pb-10">
                       <header className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200/50">
                                <Check size={20} />
                             </div>
                             <div>
                                <h3 className={`text-lg font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Проверка</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Последний шаг</p>
                             </div>
                          </div>
                          <Sparkle size={24} className="text-pink-300 animate-pulse" />
                       </header>
                       
                       <div className="space-y-4">
                          {/* Items List Card */}
                          <div className={`rounded-[32px] p-6 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                             <div className="flex items-center justify-between mb-4">
                                <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Ваш заказ</p>
                                <span className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-[10px] font-black">{cart.reduce((acc, item) => acc + item.quantity, 0)} шт.</span>
                             </div>
                             <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                                {cart.map(item => (
                                  <div key={item.id} className="flex justify-between items-center group">
                                     <div className="flex flex-col">
                                        <span className={`text-xs font-bold ${isDarkMode ? 'text-white/90' : 'text-gray-800'}`}>{item.name}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Количество: {item.quantity}</span>
                                     </div>
                                     <span className="text-xs font-black text-pink-500">{item.price * item.quantity} ₽</span>
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* Delivery & Address Card */}
                          <div className={`rounded-[32px] p-4 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                             <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                   <MapPin size={16} />
                                </div>
                                <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Доставка</p>
                             </div>
                             <div className="space-y-1">
                                <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                   {DELIVERY_PROVIDERS.find(p => p.id === selectedProvider)?.name}
                                </p>
                                <p className={`text-xs font-medium leading-relaxed opacity-70 ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                                   {deliveryAddress}
                                </p>
                             </div>
                          </div>


                          {/* Payment Methods */}
                          <div className={`rounded-[32px] p-4 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                             <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Способ оплаты</p>
                             <div className="grid grid-cols-3 gap-2">
                                {/* SBP */}
                                <button 
                                   onClick={() => setSelectedPaymentMethod('sbp')}
                                   className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                                      selectedPaymentMethod === 'sbp' 
                                         ? 'border-pink-500 bg-pink-50/30' 
                                         : isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-white hover:border-pink-100'
                                   }`}
                                >
                                   <div className="w-7 h-7 flex items-center justify-center text-pink-500">
                                      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                         <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                         <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                         <path d="M20 7L12 12L4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                   </div>
                                   <span className={`text-[10px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>СБП</span>
                                </button>

                                {/* Yookassa */}
                                <button 
                                   onClick={() => setSelectedPaymentMethod('yookassa')}
                                   className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                                      selectedPaymentMethod === 'yookassa' 
                                         ? 'border-pink-500 bg-pink-50/30' 
                                         : isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-white hover:border-pink-100'
                                   }`}
                                >
                                   <Wallet size={20} className="text-pink-500" />
                                   <span className={`text-[10px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ЮKassa</span>
                                </button>

                                {/* Card */}
                                <button 
                                   onClick={() => setSelectedPaymentMethod('card')}
                                   className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                                      selectedPaymentMethod === 'card' 
                                         ? 'border-pink-500 bg-pink-50/30' 
                                         : isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-white hover:border-pink-100'
                                   }`}
                                >
                                   <CreditCard size={20} className="text-pink-500" />
                                   <span className={`text-[10px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Карта</span>
                                </button>
                             </div>
                          </div>

                          {/* Bonus Points Section */}
                         {(currentUser?.bonusBalance || 0) > 0 && (
                           <div className={`rounded-[32px] p-4 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-amber-50/20 border-amber-100 shadow-sm'}`}>
                              <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                                       <Coins size={18} />
                                    </div>
                                    <div>
                                       <span className={`text-xs font-black uppercase tracking-widest block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Бонусы</span>
                                       <span className="text-[10px] text-amber-600 font-bold">Баланс: {currentUser?.bonusBalance}</span>
                                    </div>
                                 </div>
                                 <button 
                                    onClick={() => {
                                       const newVal = !useBonuses;
                                       setUseBonuses(newVal);
                                       if (newVal) setBonusToSpend(Math.min(currentUser?.bonusBalance || 0, maxBonusAllowed));
                                    }}
                                    className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${useBonuses ? 'bg-amber-500' : 'bg-gray-200'}`}
                                 >
                                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all ${useBonuses ? 'translate-x-5' : 'translate-x-0'} left-0.5`} />
                                 </button>
                              </div>
                              
                              {useBonuses && (
                                 <div className="space-y-2 animate-fadeIn px-1">
                                    <div className="relative pt-1">
                                       <input 
                                          type="range"
                                          min="0"
                                          max={Math.min(currentUser?.bonusBalance || 0, maxBonusAllowed)}
                                          value={bonusToSpend}
                                          onChange={(e) => setBonusToSpend(parseInt(e.target.value))}
                                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                       />
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                                       <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bonusToSpend} баллов</span>
                                       <div className="flex items-center gap-1">
                                          <span className="text-xs font-black text-amber-600">Скидка:</span>
                                          <span className="text-sm font-black text-amber-600">-{bonusToSpend} ₽</span>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                         )}

                         {/* Comment Field */}
                         <div className={`rounded-[32px] p-4 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2 px-1">Комментарий к заказу</p>
                            <textarea 
                               value={orderComment}
                               onChange={(e) => setOrderComment(e.target.value)}
                               placeholder="Пожелания..."
                               className={`w-full p-3 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all resize-none h-16 ${
                                  isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-100 text-gray-900'
                               }`}
                            />
                         </div>

                         {/* Summary Card */}
                         <div className={`rounded-[32px] p-5 border transition-all ${isDarkMode ? 'bg-white text-black border-white' : 'bg-gray-900 text-white border-gray-900 shadow-2xl shadow-gray-900/20'}`}>
                            <div className="space-y-2 mb-4">
                               <div className="flex justify-between items-center opacity-60 text-xs font-bold">
                                  <span>Сумма заказа</span>
                                  <span>{cartTotal} ₽</span>
                               </div>
                               <div className="flex justify-between items-center opacity-60 text-xs font-bold">
                                  <span>Доставка</span>
                                  <span>{deliveryFee} ₽</span>
                               </div>
                               {useBonuses && bonusToSpend > 0 && (
                                 <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                                    <span>Скидка бонусами</span>
                                    <span>-{bonusToSpend} ₽</span>
                                 </div>
                               )}
                            </div>
                            <div className="flex justify-between items-end">
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Итого к оплате</span>
                                  <span className="text-2xl font-black tracking-tighter">{finalTotal} ₽</span>
                                </div>
                               <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                  <CreditCard size={20} />
                               </div>
                            </div>
                         </div>
                       </div>

                       <div className="space-y-3 pt-2">
                          <button 
                            onClick={finishCheckout} 
                            className={`w-full font-black py-5 rounded-[32px] uppercase text-sm tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 ${
                              isDarkMode ? 'bg-pink-500 text-white shadow-pink-500/20' : 'bg-pink-500 text-white shadow-pink-500/30'
                            }`}
                          >
                            Подтвердить заказ
                            <ArrowRight size={20} />
                          </button>
                          <button 
                            onClick={() => setCheckoutStep(2)} 
                            className={`w-full font-black py-2 rounded-[32px] uppercase text-[10px] tracking-widest transition-all ${
                              isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            Вернуться к адресу
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] p-8 animate-slideUp relative shadow-2xl pb-10">
             <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white"><Edit3 size={18} /></div>
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Профиль</h3>
                </div>
                <button onClick={() => setIsEditingProfile(false)} className="p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20} /></button>
             </header>
             <div className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Имя</label>
                   <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Ваше имя" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Город</label>
                   <div className="relative">
                     <input type="text" value={citySearch} onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }} onFocus={() => setShowCityDropdown(true)} placeholder="Ваш город" className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-5 py-4 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all" />
                   </div>
                </div>
             </div>
             <button onClick={() => { setCurrentUser(prev => prev ? {...prev, name: editName, city: citySearch} : null); setIsEditingProfile(false); }} className="w-full mt-10 bg-gray-900 text-white font-black py-5 rounded-[24px] shadow-2xl uppercase text-xs tracking-widest">Сохранить</button>
          </div>
        </div>
      )}

      {/* Nav Bar */}
      <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t px-6 py-4 flex justify-between items-center z-40 rounded-t-[32px] transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800 shadow-[0_-15px_50px_rgba(0,0,0,0.3)]' : 'bg-white border-gray-50 shadow-[0_-15px_50px_rgba(0,0,0,0.08)]'}`}>
        <button onClick={() => { setActiveTab('shop'); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'shop' ? 'text-pink-500' : 'text-gray-300'}`}>
          <ShoppingBag size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Шоп</span>
        </button>
        <button onClick={() => { setActiveTab('zen'); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'zen' ? 'text-green-500' : 'text-gray-300'}`}>
          <Sparkles size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Дзен</span>
        </button>
        <button onClick={() => { setIsCartOpen(true); }} className={`flex flex-col items-center gap-1 transition-all relative ${isCartOpen ? 'text-blue-500' : 'text-gray-300'}`}>
          <ShoppingBag size={22} />
          {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded-full flex items-center justify-center font-black shadow-lg animate-fadeIn">{cartTotal} ₽</span>}
          <span className="text-[8px] font-black uppercase tracking-widest">Корзина</span>
        </button>
        <button onClick={() => { setActiveTab('profile'); }} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-300'}`}>
          <User size={22} />
          <span className="text-[8px] font-black uppercase tracking-widest">Я</span>
        </button>
      </nav>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Dark Mode Overrides */
        .dark .bg-white { background-color: #1a1a1a !important; }
        .dark .text-gray-900 { color: #ffffff !important; }
        .dark .text-gray-800 { color: #f3f4f6 !important; }
        .dark .text-gray-700 { color: #e5e5e5 !important; }
        .dark .text-gray-600 { color: #d1d5db !important; }
        .dark .text-gray-500 { color: #9ca3af !important; }
        .dark .bg-gray-50 { background-color: #262626 !important; }
        .dark .bg-gray-100 { background-color: #262626 !important; }
        .dark .bg-gray-50\/20 { background-color: rgba(38, 38, 38, 0.2) !important; }
        .dark .bg-gray-50\/50 { background-color: rgba(38, 38, 38, 0.5) !important; }
        .dark .border-gray-50 { border-color: #333333 !important; }
        .dark .border-gray-100 { border-color: #333333 !important; }
        .dark .border-pink-50 { border-color: #333333 !important; }
        .dark .text-gray-400 { color: #888888 !important; }
        .dark .bg-pink-50 { background-color: rgba(236, 72, 153, 0.1) !important; }
        .dark .shadow-sm { box-shadow: none !important; }
        .dark .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important; }
        .dark input { color: white !important; }
        .dark select { background-color: #262626 !important; color: white !important; }

        /* Hide Yandex Maps branding */
        [class*="ymaps-2-1"][class*="-copyright"],
        [class*="ymaps-2-1"][class*="-logo"],
        [class*="ymaps-2-1"][class*="-promo"],
        [class*="ymaps-2-1"][class*="-map-copyrights-promo"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default App;
