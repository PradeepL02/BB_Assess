import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Text, Link } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("http://localhost:5000/login", values);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/notes");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card
        title="Login"
        className="w-full max-w-md rounded-2xl shadow-xl"
        headStyle={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}
      >
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          {/* <Form.Item>
            <Text>
              Don't have an account?{" "}
              <Link onClick={() => navigate("/register")}>Register</Link>
            </Text>
          </Form.Item> */}
        </Form>
      </Card>
    </div>
  );
}
