import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Button, DatePicker, Form, Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
const { RangePicker } = DatePicker;
function Analysis() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [dates, setDates] = useState([]);
  
  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("/api/admin/get-analysis-1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          startDate: moment(dates[0]).format("YYYY-MM-DD"),
          endDate: moment(dates[1]).format("YYYY-MM-DD"),
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setUsers(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const handleDateRangeChange = (dates, dateString) => {
    // Update the dates state with the selected date range
    setDates(dates);
    console.log(dates)
  };

  const columns = [
    {
      title: "Specialization",
      dataIndex: "_id",
    },
    {
      title: "Total Revenue",
      dataIndex: "totalAmountPaid",
    },
    
  ];

  return (
    <Layout>
      <h1 className="page-header">Analysis-1</h1>
      <hr />
      <p>Top revenue generating Specializations between years</p>
      <hr/>
      <Form
        layout="vertical"
        onFinish={() => {
          // Call getUsersData with the formatted dates when the form is submitted
          getUsersData(
            moment(dates[0]).format("YYYY-MM-DD"),
            moment(dates[1]).format("YYYY-MM-DD")
          );
        }}
      >
        <Form.Item name="dates">
          <RangePicker onChange={handleDateRangeChange} picker="year"/>
        </Form.Item>
        <Button className="primary-button my-2 full-width-button" htmlType="submit">
          Search
        </Button>
      </Form>
      <Table columns={columns} dataSource={users}/>
    </Layout>
  );
}

export default Analysis;
