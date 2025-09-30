import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header: AntHeader } = Layout;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Avatar dropdown menu
  const avatarMenu = (
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

  const selectedKey = location.pathname.includes("/notes") ? "notes" : "users";

  // Main navigation menu (admin only)
  const mainMenu = (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      style={{ lineHeight: "64px" }}
    >
      <Menu.Item
        key="users"
        icon={<UserOutlined />}
        onClick={() => navigate("/user")}
      >
        Users
      </Menu.Item>
      <Menu.Item
        key="notes"
        icon={<FileTextOutlined />}
        onClick={() => navigate("/notes")}
      >
        Notes
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="flex justify-between items-center bg-white shadow px-6">
      {/* Left: main menu only for admin */}
      {role === "admin" ? (
        <div className="items-center w-xs">{mainMenu}</div>
      ) : (
        <div></div> 
      )}

      {/* Right: avatar/profile dropdown */}
      <div className="flex items-center justify-end">
        <Dropdown overlay={avatarMenu} placement="bottomRight">
          <Avatar
            style={{ backgroundColor: "#1890ff", cursor: "pointer" }}
            size="large"
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
