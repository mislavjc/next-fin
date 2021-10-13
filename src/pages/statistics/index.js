import axios from 'axios';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/client';
import { Bar } from 'react-chartjs-2';
import dayjs from 'dayjs';

import Container from '@mui/material/Container';

import { CollectionSelect } from '@/components/CollectionSelect';

import Form from '@/models/form';
import User from '@/models/user';
import Type from '@/models/type';
import { default as Inputs } from '@/models/input';
import Option from '@/models/option';


import { dbConnect } from '@/middleware/db';

export async function getServerSideProps(context) {
  dbConnect();
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, { Location: '/api/auth/signin' });
    context.res.end();
    return {
      props: {
        owner: false,
        forms: false,
      },
    };
  }
  const { user } = session;
  const owner = await User.findOne({ email: user.email });
  const types = await Type.find({ option: owner.option });
  const option = await Option.findById(owner.option);
  const inputs = await Inputs.find({ option: owner.option }).populate({
    path: 'type',
  });
  const forms = await Form.find({
    option: owner.option,
    archived: false,
    title: option.titles[1],
  }).populate({
    path: 'inputs',
    populate: {
      path: 'type',
    },
  });

  const wrapper = {};
  const tempData = {};
  for (let form of forms) {
    let count = 0;
    let value;
    for (let input of form.inputs) {
      if (input.type.type === 'date') {
        value = dayjs(input.value).format('DD.MM.YYYY');
      } else {
        value = input.value;
      }
      if (!wrapper.hasOwnProperty(input.type.name))
        wrapper[input.type.name] = {};
      if (tempData.hasOwnProperty(value)) {
        count++;
      } else {
        count = 1;
      }
      if (wrapper[input.type.name].hasOwnProperty(value)) {
        wrapper[input.type.name][value] = count++;
      } else {
        wrapper[input.type.name][value] = count;
      }
      tempData[value] = count;
    }
  }
  const dataArr = [];

  for (const [key, value] of Object.entries(wrapper)) {
    const objData = Object.keys(value).map((key) => {
      return value[key];
    });
    const graphData = {
      labels: Object.keys(value),
      datasets: [
        {
          label: '# unosa',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
          data: objData,
        },
      ],
    };
    const graphOptions = {
      ...options,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: key,
        },
      },
    };
    dataArr.push({ graphData, graphOptions });
  }

  return {
    props: {
      owner: JSON.parse(JSON.stringify(owner)),
      option: JSON.parse(JSON.stringify(option)),
      dataArr,
    },
  };
}

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
};

export default function AllItems({
  owner,
  option,
  dataArr,
}) {
  const [dataObj, setDataObj] = useState({});
  const [entries, setEntries] = useState(dataArr);
  const [selectedTitle, setSelectedTitle] = useState(
    option ? option.titles[0] : ''
  );

  useEffect(() => {
    axios
      .post('/api/statistics', {
        title: selectedTitle,
        owner,
      })
      .then((res) => {
        setEntries(res.data);
      })
      .then(() => setDataObj({}))
      .then(() => localStorage.setItem('selectedTitle', selectedTitle));
  }, [selectedTitle]);

  useEffect(() => {
    if (localStorage.getItem('selectedTitle')) {
      setSelectedTitle(localStorage.getItem('selectedTitle'));
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Container maxWidth="lg">
        {option && (
          <CollectionSelect
            option={option}
            value={selectedTitle}
            onChange={setSelectedTitle}
          />
        )}
        <div>
          {entries.map((graph, index) => (
              <Bar
                data={graph.graphData}
                options={graph.graphOptions}
                key={index}
              />
          ))}
        </div>
      </Container>
    </div>
  );
}
