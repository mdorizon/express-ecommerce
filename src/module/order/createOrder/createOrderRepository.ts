import {Order} from "../Order";

export interface CreateOrderRepository {
    save(order: Order): Promise<void>;
    deleteAll(): Promise<void>;
}
