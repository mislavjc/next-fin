import Form from '@/models/form';
import Type from '@/models/type';

import { dbConnect } from '@/middleware/db';

const readHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { owner, title, archived } = req.body;
    const forms = await Form.find({
      option: owner.option,
      title,
      archived,
    })
      .limit(12)
      .populate({
        path: 'inputs',
        populate: {
          path: 'type',
        },
      });
    const formCount = await Form.countDocuments({
      option: owner.option,
      archived: false,
      title,
    });
    const types = await Type.find({ option: owner.option, title });
    res.send({ forms, types, formCount });
  }
};

export default readHandler;
