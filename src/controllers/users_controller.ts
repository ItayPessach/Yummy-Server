import UserModel, { IUser } from "../models/user_model";
import createController from "./base_controller";

const usersController = createController<IUser>(UserModel);

export default usersController;
