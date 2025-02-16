import React, { useState } from "react";
import { Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      message.error("Please fill in all fields");
      return;
    }
    if (newPassword.length < 8) {
      message.warning("Password should be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      message.success("Password updated successfully!");
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center items-center min-h-screen  p-4"
    >
      <Card className="p-6 shadow-sm border rounded-2xl w-full max-w-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Update Password
        </h2>

        {/* Old Password */}
        <div className="mb-3">
          <label className="font-medium text-gray-600">Current Password</label>
          <Input.Password
            size="large"
            placeholder="Enter old password"
            prefix={<LockOutlined />}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        {/* New Password */}
        <div className="mb-3">
          <label className="font-medium text-gray-600">New Password</label>
          <Input.Password
            size="large"
            placeholder="Enter new password"
            prefix={<LockOutlined />}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm New Password */}
        <div className="mb-4">
          <label className="font-medium text-gray-600">
            Confirm New Password
          </label>
          <Input.Password
            size="large"
            placeholder="Confirm new password"
            prefix={<LockOutlined />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          block
          size="large"
          loading={loading}
          style={{ backgroundColor: "#FF6B00", borderColor: "#FF6B00" }}
          onClick={handleChangePassword}
        >
          Update Password
        </Button>
      </Card>
    </motion.div>
  );
};

export default ChangePassword;
