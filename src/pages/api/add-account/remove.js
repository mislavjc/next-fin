import User from '@/models/user';
import Option from '@/models/option';

import { dbConnect } from '@/middleware/db';

const removeAccountHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { email, owner  } = req.body;
    const option = await Option.findById(owner.option);
    const username = email.split('@')[0].replace('.', '');
    delete option.owner[username];
    await option.save();
    const user = await User.findOne({ email });
    user.option = null;
    await user.save();

    res.status(201).json({ message: 'all ok' });
  }
};

export default removeAccountHandler;
