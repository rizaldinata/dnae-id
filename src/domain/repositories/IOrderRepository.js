/**
  * Interface IOrderRepository
  */
export class IOrderRepository {
  async getOrders(status = null) {
    throw new Error('Method getOrders() must be implemented');
  }
  async createOrder(order) {
    throw new Error('Method createOrder() must be implemented');
  }
  async updateOrderStatus(orderId, status) {
    throw new Error('Method updateOrderStatus() must be implemented');
  }
  async deleteOrder(orderId) {
    throw new Error('Method deleteOrder() must be implemented');
  }
}
