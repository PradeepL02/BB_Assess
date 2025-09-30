// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Button, Input, Form, Card, Space, message, Modal } from "antd";
// import Header from "../common/Header";
// import RegisterPage from "../login & register/register";

// export default function NotesPage() {
//   const [notes, setNotes] = useState([]);
//   const [role, setRole] = useState([]);
//   const [form] = Form.useForm();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const token = localStorage.getItem("token");

//   const fetchNotes = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/notes", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotes(res.data);
//     } catch (err) {
//       message.error(err.response?.data?.error || "Failed to fetch notes");
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, []);

//   const handleAddNote = async (values) => {
//     try {
//       await axios.post(
//         "http://localhost:5000/notes",
//         { title: values.title, description: values.description },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       form.resetFields();
//       setIsModalVisible(false);
//       fetchNotes();
//       message.success("Note added successfully");
//     } catch (err) {
//       message.error(err.response?.data?.error || "Failed to add note");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/notes/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchNotes();
//       message.success("Note deleted successfully");
//     } catch (err) {
//       message.error(err.response?.data?.error || "Failed to delete note");
//     }
//   };

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => {
//         const userRole = JSON.parse(atob(token.split(".")[1])).role;
//         setRole(userRole);
//         return userRole === "admin" ? (
//           <Button danger onClick={() => handleDelete(record.id)}>
//             Delete
//           </Button>
//         ) : null;
//       },
//     },
//   ];

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <Header />
//       <div className="max-w-full mx-auto mt-3 mb-6 flex justify-end">
//         {role === 'admin' && <RegisterPage/>}
//         <Button type="primary" onClick={showModal}>
//           Add Note
//         </Button>
//       </div>

//       <Modal
//         title="Add Note"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <Form form={form} layout="vertical" onFinish={handleAddNote}>
//           <Form.Item
//             label="Title"
//             name="title"
//             rules={[{ required: true, message: "Please enter title" }]}
//           >
//             <Input placeholder="Title" />
//           </Form.Item>
//           <Form.Item
//             label="Description"
//             name="description"
//             rules={[{ required: true, message: "Please enter description" }]}
//           >
//             <Input.TextArea rows={4} placeholder="Description" />
//           </Form.Item>
//           <Form.Item>
//             <Space>
//               <Button type="primary" htmlType="submit">
//                 Add Note
//               </Button>
//               <Button onClick={handleCancel}>Cancel</Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Card title="Notes List" className="max-w-full mx-auto">
//         <Table
//           dataSource={notes}
//           columns={columns}
//           rowKey="id"
//           pagination={{ pageSize: 5 }}
//         />
//       </Card>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Input,
  Form,
  Card,
  Space,
  message,
  Modal,
  Select,
} from "antd";
import Header from "../common/Header";

const { Option } = Select;

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [form] = Form.useForm();
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const token = localStorage.getItem("token");
  const userRole = token ? JSON.parse(atob(token.split(".")[1])).role : "";

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (values) => {
    try {
      await axios.post(
        "http://localhost:5000/notes",
        { title: values.title, description: values.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      form.resetFields();
      setIsNoteModalVisible(false);
      fetchNotes();
      message.success("Note added successfully");
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to add note");
    }
  };

  const handleAddUser = async (values) => {
    try {
      await axios.post("http://localhost:5000/register", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User added successfully");
      form.resetFields();
      setIsUserModalVisible(false);
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
      message.success("Note deleted successfully");
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to delete note");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        userRole === "admin" ? (
          <Button danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Header />

      {/* Buttons */}
      <div className="max-w-full mx-auto mt-3 mb-6 flex justify-end gap-2">
        {userRole === "admin" && (
          <Button type="default" onClick={() => setIsUserModalVisible(true)}>
            Add User
          </Button>
        )}
        <Button type="primary" onClick={() => setIsNoteModalVisible(true)}>
          Add Note
        </Button>
      </div>

      {/* Add Note Modal */}
      <Modal
        title="Add Note"
        open={isNoteModalVisible}
        onCancel={() => {
          setIsNoteModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddNote}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} placeholder="Description" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Note
              </Button>
              <Button
                onClick={() => {
                  setIsNoteModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add User Modal */}
      <Modal
        title="Add User"
        open={isUserModalVisible}
        onCancel={() => {
          setIsUserModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter username" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add User
              </Button>
              <Button
                onClick={() => {
                  setIsUserModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Notes Table */}
      <Card title="Notes List" className="max-w-full mx-auto">
        <Table
          dataSource={notes}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
}
