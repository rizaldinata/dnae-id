import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { OrderModel } from '../models/OrderModel';
import { SupabaseOrderDataSource } from '../datasources/SupabaseOrderDataSource';

export class OrderRepositoryImpl extends IOrderRepository {
  async getOrders(status = null) {
    const rawData = await SupabaseOrderDataSource.getOrders(status);
    return rawData.map((order) => OrderModel.fromJson(order));
  }

  async createOrder(orderEntity) {
    const json = OrderModel.toJson(orderEntity);
    const savedJson = await SupabaseOrderDataSource.createOrder(json);
    return OrderModel.fromJson(savedJson);
  }

  async updateOrderStatus(orderId, status) {
    const updatedJson = await SupabaseOrderDataSource.updateOrderStatus(orderId, status);
    return OrderModel.fromJson(updatedJson);
  }

  async deleteOrder(orderId) {
    return await SupabaseOrderDataSource.deleteOrder(orderId);
  }
}
