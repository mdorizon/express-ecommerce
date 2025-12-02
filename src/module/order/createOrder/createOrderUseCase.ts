import { CreateOrderRepository } from "./createOrderRepository";
import { Order } from "../Order";

export class CreateOrderUseCase {
  private orderRepository: CreateOrderRepository;

  constructor(orderRepository: CreateOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute({
    productId,
    quantity,
    priceAtOrderTime,
  }: {
    productId: number;
    quantity: number;
    priceAtOrderTime: number;
  }): Promise<void> {
    try {
      await this.orderRepository.deleteAll();
    } catch (error) {
      throw new Error("erreur lors de la suppression de l'ancienne commande");
    }

    const order = new Order({ productId, quantity, priceAtOrderTime });

    try {
      await this.orderRepository.save(order);
    } catch (error) {
      throw new Error("erreur lors de la création de la commande");
    }
  }
}
