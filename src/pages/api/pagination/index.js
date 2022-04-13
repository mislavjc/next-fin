import Form from '@/models/form';
import Type from '@/models/type';

import { dbConnect } from '@/middleware/db';

const paginationHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { owner, title, archived, page } = req.body;
    const forms = await Form.find({
      option: owner.option,
      title,
      archived,
    })
      .limit(12)
      .skip(12 * (page - 1))
      .populate({
        path: 'inputs',
        populate: {
          path: 'type',
        },
      });
    const types = await Type.find({ option: owner.option, title });

    console.log('paging');

    res.send({ forms, types });
  }
};

export default paginationHandler;
