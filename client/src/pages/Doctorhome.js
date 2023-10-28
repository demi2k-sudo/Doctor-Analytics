import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import Schedule from "../components/schedule";
function Homedoc() {
  const [schedules, setSchedule] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.get("/api/doctor/get-schedules", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading())
      if (response.data.success) {
        setSchedule(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading())
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <Row gutter={20}>
        {schedules.map((schedule) => (
          <Col span={8} xs={24} sm={24} lg={8}>
            <Schedule schedule={schedule} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}

export default Homedoc;
