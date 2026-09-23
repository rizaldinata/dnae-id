export class Order {
  constructor({
    id,
    orderCode,
    customerName,
    customerPhone,
    orderType = 'pickup', // pickup | delivery
    paymentMethod = 'cod', // cod | qris
    address = '',
    notes = '',
    items = [], // Array of { menuItem, quantity, itemTotal }
    totalPrice = 0,
    expense = 0,
    status = 'pending', // pending | processing | completed | cancelled
    createdAt = new Date().toISOString(),
  }) {
    this.id = id;
    this.orderCode = orderCode || `GB-${Math.floor(10000 + Math.random() * 90000)}`;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.orderType = orderType;
    this.paymentMethod = paymentMethod;
    this.address = address;
    this.notes = notes;
    this.items = items;
    this.totalPrice = totalPrice;
    this.expense = expense;
    this.status = status;
    this.createdAt = createdAt;
  }

  getFormattedTotal() {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(this.totalPrice);
  }
}
