import Order from "../models/Order";
import { createCrudController } from "./crudController";

export const orderController = createCrudController(Order);
