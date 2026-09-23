export class GetOrdersUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(statusFilter = 'all') {
    return await this.orderRepository.getOrders(statusFilter);
  }
}
