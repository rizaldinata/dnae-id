import { Order } from '../../domain/entities/Order';

export class OrderModel {
  static fromJson(json) {
    return new Order({
      id: json.id,
      orderCode: json.order_code || json.orderCode,
      customerName: json.customer_name || json.customerName,
      customerPhone: json.customer_phone || json.customerPhone,
      orderType: json.order_type || json.orderType || 'pickup',
      paymentMethod: json.payment_method || json.paymentMethod || 'cod',
      address: json.address || '',
      notes: json.notes || '',
      items: typeof json.items === 'string' ? JSON.parse(json.items) : (json.items || []),
      totalPrice: Number(json.total_price || json.totalPrice || 0),
      expense: Number(json.expense || 0),
      status: json.status || 'pending',
      createdAt: json.created_at || json.createdAt || new Date().toISOString(),
    });
  }

  static toJson(order) {
    return {
      id: order.id,
      order_code: order.orderCode,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      order_type: order.orderType,
      payment_method: order.paymentMethod,
      address: order.address,
      notes: order.notes,
      items: JSON.stringify(order.items),
      total_price: order.totalPrice,
      expense: order.expense,
      status: order.status,
      created_at: order.createdAt,
    };
  }
}
