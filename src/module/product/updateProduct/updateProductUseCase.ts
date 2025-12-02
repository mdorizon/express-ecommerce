import AppDataSource from "../../../config/db.config";
import {Product} from "../Product";

export default class UpdateProductUseCase {

    async execute({id, title, description, price}: {id: number, title: string, description: string, price: number}) {

        const typeOrmRepository = AppDataSource.getRepository<Product>(Product);

        const product = await typeOrmRepository.findOneBy({id});

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.price < 0) {
            throw new Error("Price cannot be negative");
        }

        product.title = title;
        product.description = description;
        product.price = price;

        await typeOrmRepository.save(product);


    }

}
