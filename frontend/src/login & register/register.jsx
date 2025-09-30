import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Select, Card, message } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

export default function RegisterPage() {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await axios.post("http://localhost:5000/register", values);
            toast.success("Registered successfully! Please login.");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-teal-500 to-blue-400 p-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <Card
                title="Register"
                className="w-full max-w-md rounded-2xl shadow-xl"
                headStyle={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ role: "user" }}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: "Please enter your username" },
                            { min: 3, message: "Username must be at least 3 characters" },
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: "Please select a role" }]}
                    >
                        <Select>
                            <Option value="user">User</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
