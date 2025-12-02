import { describe, expect, test } from "@jest/globals";
import { CreateOrderUseCase } from "../createOrderUseCase";
import { CreateOrderRepository } from "../createOrderRepository";
import { Order } from "../../Order";

class CreateOrderDummyRepository implements CreateOrderRepository {
  async save(order: Order): Promise<void> {
    // Ne fait rien, c'est un dummy
  }

  async deleteAll(): Promise<void> {
    // Ne fait rien, c'est un dummy
  }
}

class CreateOrderMockFailRepository implements CreateOrderRepository {
  async save(order: Order): Promise<void> {
    throw new Error("fail repository save");
  }

  async deleteAll(): Promise<void> {
    // Ne fait rien
  }
}

describe("US-X : Créer une commande", () => {
  test("Scénario 1 : Créer une commande valide", async () => {
    // Étant donné qu'aucune commande n'existe
    const createOrderRepository = new CreateOrderDummyRepository();
    const createOrderUseCase = new CreateOrderUseCase(createOrderRepository);

    await expect(
      // Quand l'utilisateur crée une commande avec un produit et une quantité valide
      createOrderUseCase.execute({
        productId: 1,
        quantity: 2,
        priceAtOrderTime: 50,
      })
      // Alors la commande est créée
    ).resolves.not.toThrow();
  });

  test("Scénario 2 : Refuser la commande si la quantité dépasse 3", async () => {
    // Étant donné qu'un produit est disponible
    const createOrderRepository = new CreateOrderDummyRepository();
    const createOrderUseCase = new CreateOrderUseCase(createOrderRepository);

    await expect(
      // Quand l'utilisateur tente de créer une commande avec une quantité supérieure à 3
      createOrderUseCase.execute({
        productId: 1,
        quantity: 4,
        priceAtOrderTime: 50,
      })
      // Alors un message d'erreur "Quantité maximale : 3" est affiché
    ).rejects.toThrow("Quantité maximale : 3");
  });

  test("Scénario 3 : Refuser la commande si le prix total dépasse 200€", async () => {
    // Étant donné qu'un produit est disponible à 100€
    const createOrderRepository = new CreateOrderDummyRepository();
    const createOrderUseCase = new CreateOrderUseCase(createOrderRepository);

    await expect(
      // Quand l'utilisateur tente de créer une commande avec 3 fois ce produit
      createOrderUseCase.execute({
        productId: 1,
        quantity: 3,
        priceAtOrderTime: 100,
      })
      // Alors un message d'erreur "Prix total maximum : 200€" est affiché
    ).rejects.toThrow("Prix total maximum : 200€");
  });

  test("Scénario 4 : Refuser la commande si la quantité est négative ou nulle", async () => {
    // Étant donné qu'un produit est disponible
    const createOrderRepository = new CreateOrderDummyRepository();
    const createOrderUseCase = new CreateOrderUseCase(createOrderRepository);

    await expect(
      // Quand l'utilisateur tente de créer une commande avec une quantité de 0
      createOrderUseCase.execute({
        productId: 1,
        quantity: 0,
        priceAtOrderTime: 50,
      })
      // Alors une erreur doit être envoyée
    ).rejects.toThrow("La quantité doit être supérieure à 0");
  });

  test("Scénario 5 : création échouée, échec de sauvegarde non prévue", async () => {
    // Étant donné qu'il n'y a pas de commande enregistrée
    const createOrderRepository = new CreateOrderMockFailRepository();
    const createOrderUseCase = new CreateOrderUseCase(createOrderRepository);

    await expect(
      // Quand je crée une commande et que la sauvegarde échoue
      createOrderUseCase.execute({
        productId: 1,
        quantity: 2,
        priceAtOrderTime: 50,
      })
      // Alors une erreur doit être envoyée «erreur lors de la création de la commande»
    ).rejects.toThrow("erreur lors de la création de la commande");
  });
});
