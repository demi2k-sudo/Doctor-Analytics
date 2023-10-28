import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, Button, Modal } from "antd"; // Import Button and Modal from Ant Design
import moment from "moment";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  // Function to handle user deletion
  const deleteUser = async (userId) => {
    try {
      dispatch(showLoading());
      console.log(userId);
      const response = await axios.delete(`/api/admin/delete-user/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          id:userId
        }
      });
      dispatch(hideLoading());
      if (response.data.success) {
        // Remove the deleted user from the local state
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
      }
    } catch (error) {
      dispatch(hideLoading());
      // Handle error
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {/* Block button with a confirmation modal */}
          <Button
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: 'Confirm Deletion',
                content: `Are you sure you want to delete ${record.name}?`,
                onOk: () => deleteUser(record._id),
              });
            }}
          >
            Block
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Fetch user data when the component mounts
    getUsersData();
  }, []);

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      // Handle error
    }
  };

  return (
    <Layout>
      <h1 className="page-header">Users List</h1>
      <hr />
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
}

export default Userslist;
