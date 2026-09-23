export class UpdateOrderStatusUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, newStatus) {
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Status ${newStatus} tidak valid`);
    }
    return await this.orderRepository.updateOrderStatus(orderId, newStatus);
  }
}
