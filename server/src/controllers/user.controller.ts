import { Request, Response } from '@customes/auth.type';
import { IFindUsers, IUserInfor } from '@interfaces/user.interface';
import { UserModel } from '@models/base/user.base';

export default class UserController {
    static findUsers = async (req: Request, res: Response) => {
        const accessToken = res.locals.accessToken;
        const { keyword } = <IFindUsers>(<unknown>req.query);
        try {
            // const users = await UserModel.find({ $text: { $search: keyword } });
            const users = await UserModel.find({ name: { $regex: new RegExp(keyword, 'i') } });
            const data: IUserInfor[] = users.map((user) => ({
                _id: user._id,
                email: user.email,
                name: user.name,
            }));
            res.status(200).json(
                accessToken ? { data: data, accessToken: accessToken } : { data: data }
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Something went wrong!' });
        }
    };
}
