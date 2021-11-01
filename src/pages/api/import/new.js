import User from '@/models/user';
import Type from '@/models/type';
import Option from '@/models/option';
import Input from '@/models/input';
import Form from '@/models/form';

import { dbConnect } from '@/middleware/db';

const importHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const {
      currentUser,
      names,
      types,
      additional,
      required,
      currency,
      importedValues,
      title,
      relationCategoryObj,
    } = req.body;
    const user = await User.findOne({ email: currentUser.email });
    const option = await Option.findById(user.option);
    option.titles.push(title);
    await option.save();
    const typeArr = [];
    for (let i = 0; i < Object.keys(names).length; i++) {
      const field = {
        name: names[i.toString()],
        type: types[i.toString()],
        required: required[i.toString()] || false,
        option,
        title,
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
      typeArr.push(type);
    }
    const totalLength = importedValues[names[0]].length;
    for (let i = 0; i < totalLength; i++) {
      const formArr = [];
      for (let j = 0; j < typeArr.length; j++) {
        let value;
        if (typeArr[j].type === 'date') {
          if (importedValues[names[j]][i] !== '') {
            value = dayjs(importedValues[names[j]][i], 'YYYY-MM-DD').toDate();
          } else {
            value = importedValues[names[j]][i];
          }
        } else {
          value = importedValues[names[j]][i];
        }
        const input = new Input({
          value,
          option,
          type: typeArr[j],
        });
        await input.save();
        formArr.push(input);
      }
      const form = new Form({
        inputs: formArr,
        option,
        title,
      });
      await form.save();
    }
    res.status(201).json({ message: 'all ok' });
  }
};

export default importHandler;
