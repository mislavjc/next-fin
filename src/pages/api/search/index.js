import mongoose from 'mongoose';

import Form from '@/models/form';
import Type from '@/models/type';

import { dbConnect } from '@/middleware/db';

const searchHandler = async (req, res) => {
  dbConnect();
  if (req.method === 'POST') {
    const { search, option } = req.body;
    const query = search.map((s) => {
      return {
        $match: {
          'inputs.value': new RegExp(s),
          option: mongoose.Types.ObjectId(option),
        },
      };
    });

    if (search !== '' && !search.includes('+')) {
      const forms = await Form.aggregate([
        {
          $lookup: {
            from: 'inputs',
            localField: 'inputs',
            foreignField: '_id',
            as: 'inputs',
          },
        },
        ...query,
      ]);
      const result = await Type.populate(forms, { path: 'inputs.type' });

      res.send(result);
    } else {
      const allForms = await Form.find({
        option: mongoose.Types.ObjectId(option),
      }).populate({
        path: 'inputs',
        populate: {
          path: 'type',
        },
      });
      res.send(allForms);
    }
    res.status(200);
  }
};

export default searchHandler;
