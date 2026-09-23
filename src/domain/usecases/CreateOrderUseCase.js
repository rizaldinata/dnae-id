import { Order } from '../entities/Order';

export class CreateOrderUseCase {
  constructor(orderRepository, formatWhatsAppUseCase) {
    this.orderRepository = orderRepository;
    this.formatWhatsAppUseCase = formatWhatsAppUseCase;
  }

  async execute(orderData) {
    const newOrder = new Order(orderData);
    
    // Save to Database / Local Data Source
    const savedOrder = await this.orderRepository.createOrder(newOrder);

    // Format WhatsApp link
    const waData = this.formatWhatsAppUseCase
      ? this.formatWhatsAppUseCase.execute(savedOrder)
      : null;

    return {
      order: savedOrder,
      whatsappUrl: waData ? waData.whatsappUrl : null,
      messageText: waData ? waData.messageText : null,
    };
  }
}
