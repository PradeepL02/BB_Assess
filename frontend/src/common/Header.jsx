import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let username = "";
  let role = "";
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    username = payload.username;
    role = payload.role;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="username" icon={<UserOutlined />}>
        {username} ({role})
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <Button type="text" onClick={handleLogout}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="flex justify-end items-center bg-white shadow px-2">
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar
          style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
          size="large"
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>
      </Dropdown>
    </AntHeader>
  );
}
