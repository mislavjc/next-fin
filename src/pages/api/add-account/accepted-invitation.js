import User from '@/models/user';
import { dbConnect } from '@/middleware/db';

const addAccountHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { id, option, username } = req.body;
    const owner = await User.findById(id);

    owner.option = option;
    owner.create = option.owner[username].create;
    owner.delete = option.owner[username].delete;
    owner.role = option.owner[username].role;
    owner.color = option.owner[username].color;

    await owner.save();

    res.status(201).json({ message: 'all ok' });
  }
};

export default addAccountHandler;
