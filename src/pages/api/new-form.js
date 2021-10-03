import User from '@/models/user';
import Type from '@/models/type';
import Option from '@/models/option';

import { dbConnect } from '@/middleware/db';

const newFromHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const {
      currentUser,
      names,
      types,
      additional,
      required,
      currency,
      title,
      relationCategoryObj,
    } = req.body;
    const user = await User.findOne({ email: currentUser.email });
    const option = await Option.findById(user.option);
    option.titles.push(title);
    await option.save();
    for (let i = 0; i < Object.keys(names).length; i++) {
      const field = {
        name: names[i.toString()],
        type: types[i.toString()],
        required: required[i.toString()] || false,
        option: option,
        title: title,
      };
      if (additional[i.toString()]) {
        field.additional = additional[i.toString()];
      }
      if (currency[i.toString()] && types[i.toString()] === 'currency') {
        field.currency = currency[i.toString()];
      }
      if (relationCategoryObj[i.toString()]) {
        const relation = await Type.findOne({
          name: relationCategoryObj[i.toString()],
          option,
        });
        field._relation = relation._id;
      }
      const type = new Type(field);
      await type.save();
    }
    res.status(201).json({ message: 'all ok' });
  }
};

export default newFromHandler;
