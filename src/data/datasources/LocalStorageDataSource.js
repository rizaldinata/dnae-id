export const INITIAL_MENU_ITEMS = [
  {
    id: 'gabin-1',
    name: 'Gabin Fla Susu Original',
    description: 'Biskuit gabin renyah dipadu fla susu vanila manis pas dan tekstur lumer yang khas.',
    price: 15000,
    category: 'Signature',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    isNew: false,
    stock: 25,
  },
  {
    id: 'gabin-2',
    name: 'Gabin Coklat Keju Lumer',
    description: 'Double keju kraft parut dan saus coklat Belgian lumer di setiap gigitan.',
    price: 18000,
    category: 'Signature',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: true,
    isNew: false,
    stock: 20,
  },
  {
    id: 'gabin-3',
    name: 'Gabin Daging Ayam Gurih',
    description: 'Varian gurih renyah dengan isian daging ayam cincang & rempah rahasia khas toko.',
    price: 18000,
    category: 'Signature',
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isBestSeller: false,
    isNew: true,
    stock: 15,
  },
];

export class LocalStorageDataSource {
  static getStorageItem(key, defaultValue = null) {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from LocalStorage`, e);
      return defaultValue;
    }
  }

  static setStorageItem(key, value) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to LocalStorage`, e);
    }
  }

  // Menu Methods
  static getMenuItems(category = null) {
    const stored = this.getStorageItem('gabin_menu_items');
    let items;
    if (!stored || stored.length === 0) {
      this.setStorageItem('gabin_menu_items', INITIAL_MENU_ITEMS);
      items = INITIAL_MENU_ITEMS;
    } else {
      items = stored;
    }

    if (category && category !== 'Semua') {
      return items.filter((item) => item.category === category);
    }
    return items;
  }

  static saveMenuItem(item) {
    const items = this.getMenuItems();
    const existingIndex = items.findIndex((i) => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }
    this.setStorageItem('gabin_menu_items', items);
    return item;
  }

  static deleteMenuItem(id) {
    const items = this.getMenuItems().filter((i) => i.id !== id);
    this.setStorageItem('gabin_menu_items', items);
    return true;
  }

  // Orders Methods
  static getOrders(status = null) {
    let orders = this.getStorageItem('gabin_orders', []);

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }
    return orders;
  }

  static saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order); // Put latest on top
    this.setStorageItem('gabin_orders', orders);
    return order;
  }

  static updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderCode === orderId);
    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      this.setStorageItem('gabin_orders', orders);
      return orders[orderIndex];
    }
    throw new Error('Pesanan tidak ditemukan');
  }

  static deleteOrder(orderId) {
    const orders = this.getOrders().filter(
      (o) => o.id !== orderId && o.orderCode !== orderId
    );
    this.setStorageItem('gabin_orders', orders);
    return true;
  }
}
