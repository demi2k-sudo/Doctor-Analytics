import { Button, Form, Input,Checkbox,Radio,message,Cascader,DatePicker } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertsSlice";

const options = [
  {
    value: 'Tamil Nadu',
    label: 'Tamil Nadu'
  },
  {
    value: 'Kerala',
    label: 'Kerala'
  },
  {
    value: 'Andhra Pradesh',
    label: 'Andhra Pradesh'
  },
  {
    value: 'Karnataka',
    label: 'Karnataka'
  },
  {
    value: 'Pondicherry',
    label: 'Pondicherry'
  },
  {
    value: 'Other',
    label: 'Other'
  }
]

const blood = [
  {
    value: 'B+',
    label: 'B+'
  },
  {
    value: 'A+',
    label: 'A+'
  },
  {
    value: 'A-',
    label: 'A-'
  },
  {
    value: 'AB+',
    label: 'AB+'
  },
  {
    value: 'A1B+',
    label: 'A1B+'
  },
  {
    value: 'B-',
    label: 'B-'
  },
  {
    value: 'O+',
    label: 'O+'
  },
  {
    value: 'O-',
    label: 'O-'
  },
  {
    value: 'Other',
    label: 'Other'
  }
]

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication1">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Nice To Meet U</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Form.Item label='State' name='state'>
          <Cascader  options={options}  placeholder="Please select" />
          </Form.Item>
          <Form.Item label='DOB' name='DOB'>
         
            <DatePicker/>
         
          </Form.Item>
          <Form.Item label = 'Height' name = 'height'>
            <Input type = 'text' required/>
          </Form.Item>
          <Form.Item label = 'Weight' name = 'weight'>
            <Input type = 'text' required/>
          </Form.Item>
          <Form.Item label='Blood group' name='blood'>
          <Cascader  options={blood}  placeholder="Please select" />
          </Form.Item>

          <Form.Item label = 'Gender' name='gender'>
          <Radio.Group>
          <Radio value='Male'>Male</Radio>
          <Radio value='Female'>Female</Radio>
          </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Checkbox>
              I agree to all the terms and Conditions
            </Checkbox>
          </Form.Item>

          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit"
          >
            REGISTER
          </Button>

          <Link to="/login" className="anchor mt-2">
            CLICK HERE TO LOGIN
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Register;
