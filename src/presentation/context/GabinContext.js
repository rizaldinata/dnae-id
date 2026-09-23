'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MenuRepositoryImpl } from '../../data/repositories/MenuRepositoryImpl';
import { OrderRepositoryImpl } from '../../data/repositories/OrderRepositoryImpl';
import { GetMenuListUseCase } from '../../domain/usecases/GetMenuListUseCase';
import { CreateOrderUseCase } from '../../domain/usecases/CreateOrderUseCase';
import { GetOrdersUseCase } from '../../domain/usecases/GetOrdersUseCase';
import { UpdateOrderStatusUseCase } from '../../domain/usecases/UpdateOrderStatusUseCase';
import { UpdateMenuStockUseCase } from '../../domain/usecases/UpdateMenuStockUseCase';
import { FormatWhatsAppMessageUseCase } from '../../domain/usecases/FormatWhatsAppMessageUseCase';

const GabinContext = createContext(null);

export function GabinProvider({ children }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';

  const menuRepository = useMemo(() => new MenuRepositoryImpl(), []);
  const orderRepository = useMemo(() => new OrderRepositoryImpl(), []);
  const formatWaUseCase = useMemo(() => new FormatWhatsAppMessageUseCase(whatsappNumber), [whatsappNumber]);

  const getMenuListUseCase = useMemo(() => new GetMenuListUseCase(menuRepository), [menuRepository]);
  const createOrderUseCase = useMemo(() => new CreateOrderUseCase(orderRepository, formatWaUseCase), [orderRepository, formatWaUseCase]);
  const getOrdersUseCase = useMemo(() => new GetOrdersUseCase(orderRepository), [orderRepository]);
  const updateStatusUseCase = useMemo(() => new UpdateOrderStatusUseCase(orderRepository), [orderRepository]);
  const updateMenuStockUseCase = useMemo(() => new UpdateMenuStockUseCase(menuRepository), [menuRepository]);

  // States
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Load Menu
  const loadMenu = async (category = activeCategory) => {
    setIsLoadingMenu(true);
    try {
      const items = await getMenuListUseCase.execute(category);
      setMenuItems(items);
    } catch (err) {
      console.error('Failed to load menu', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // Load Orders (Admin)
  const loadOrders = async (filter = statusFilter) => {
    setIsLoadingOrders(true);
    try {
      const data = await getOrdersUseCase.execute(filter);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadMenu(activeCategory);
  }, [activeCategory]);

  // Cart Methods
  const addToCart = (menuItem, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...menuItem, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Submit Order via Clean Architecture UseCase
  const submitOrder = async (customerData) => {
    if (cart.length === 0) throw new Error('Keranjang belanja masih kosong');

    const orderPayload = {
      customerName: customerData.name,
      customerPhone: customerData.phone,
      orderType: customerData.orderType,
      address: customerData.address || '',
      notes: customerData.notes || '',
      items: cart,
      totalPrice: getCartTotal(),
      status: 'pending',
    };

    const result = await createOrderUseCase.execute(orderPayload);
    
    // Clear Cart & Close Modals
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    // Return results containing whatsappUrl for redirection
    return result;
  };

  // Update Order Status (Admin)
  const changeOrderStatus = async (orderId, newStatus) => {
    await updateStatusUseCase.execute(orderId, newStatus);
    await loadOrders(statusFilter);
  };

  // Admin Menu Methods
  const addMenuItem = async (menuItemData) => {
    await menuRepository.saveMenuItem(menuItemData);
    await loadMenu();
  };

  const updateMenuItem = async (id, menuItemData) => {
    await menuRepository.updateMenuItem(id, menuItemData);
    await loadMenu();
  };

  const deleteMenuItem = async (id) => {
    await menuRepository.deleteMenuItem(id);
    await loadMenu();
  };

  const updateMenuStock = async (menuId, newStock) => {
    await updateMenuStockUseCase.execute(menuId, newStock);
    await loadMenu();
  };

  return (
    <GabinContext.Provider
      value={{
        // Menu
        menuItems,
        activeCategory,
        setActiveCategory,
        isLoadingMenu,
        loadMenu,

        // Cart
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,

        // Orders & Admin
        orders,
        isLoadingOrders,
        loadOrders,
        statusFilter,
        setStatusFilter,
        submitOrder,
        changeOrderStatus,

        // Admin Menu
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateMenuStock,

        // WA Config
        whatsappNumber,
      }}
    >
      {children}
    </GabinContext.Provider>
  );
}

export function useGabin() {
  const context = useContext(GabinContext);
  if (!context) {
    throw new Error('useGabin must be used within a GabinProvider');
  }
  return context;
}
