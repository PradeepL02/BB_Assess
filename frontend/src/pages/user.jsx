import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm } from "antd";
import axios from "axios";
import Header from "../common/Header";

const { Option } = Select;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue({ username: user.username, role: user.role });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete user");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        // Update
        await axios.put(`http://localhost:5000/user/${editingUser.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User updated successfully");
      } else {
        // Create
        await axios.post("http://localhost:5000/register", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        message.success("User created successfully");
      }
      handleCancel();
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.error || "Operation failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
        <Header />
      <div className="flex justify-between mt-4 mb-4 p-4">
        <h2>User Management</h2>
        <Button type="primary" onClick={() => openModal()}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        bordered
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingUser ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: !editingUser, message: "Password is required" }]}
          >
            <Input.Password placeholder={editingUser ? "Leave blank to keep current password" : ""} />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
