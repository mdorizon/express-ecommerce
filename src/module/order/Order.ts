import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "int" })
  public productId: number;

  @Column({ type: "int" })
  public quantity: number;

  @Column({ type: "float" })
  public priceAtOrderTime: number;

  @Column({ type: "float" })
  public totalPrice: number;

  @Column({ type: "date" })
  public createdAt: Date;

  constructor({
    productId,
    quantity,
    priceAtOrderTime,
  }: {
    productId: number;
    quantity: number;
    priceAtOrderTime: number;
  }) {
    this.validateQuantity(quantity);
    this.productId = productId;
    this.quantity = quantity;
    this.priceAtOrderTime = priceAtOrderTime;
    this.totalPrice = this.calculateTotalPrice(quantity, priceAtOrderTime);
    this.validateTotalPrice(this.totalPrice);
    this.createdAt = new Date();
  }

  private validateQuantity(quantity: number) {
    if (quantity > 3) {
      throw new Error("Quantité maximale : 3");
    }
    if (quantity <= 0) {
      throw new Error("La quantité doit être supérieure à 0");
    }
  }

  private calculateTotalPrice(quantity: number, price: number): number {
    return quantity * price;
  }

  private validateTotalPrice(totalPrice: number) {
    if (totalPrice > 200) {
      throw new Error("Prix total maximum : 200€");
    }
  }
}
