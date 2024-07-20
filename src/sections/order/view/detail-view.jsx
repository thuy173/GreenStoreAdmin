import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import LoadingPage from 'src/pages/loading_page';
import OrderServices from 'src/services/OrderServices';

import DetailOrder from './detail-dialog';

const DetailDialogView = ({ orderId }) => {
  const [dataDetail, setDataDetail] = useState(null);

  const fetchData = async () => {
    try {
      const response = await OrderServices.getById(orderId);
      if (response?.data && response?.status === 200) {
        setDataDetail(response.data);
      } else {
        console.error(response ?? 'Unexpected response structure');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return <div>{dataDetail ? <DetailOrder initialValues={dataDetail} /> : <LoadingPage />}</div>;
};

DetailDialogView.propTypes = {
  orderId: PropTypes.number,
};
export default DetailDialogView;
