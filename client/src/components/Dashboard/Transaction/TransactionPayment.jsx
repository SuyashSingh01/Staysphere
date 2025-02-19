import React, { useMemo, useState } from "react";
import { Table, Tag, Card, Select, Spin, Alert } from "antd";
import { useTransactions } from "../../../hooks/useQueryTransactionData";
import { motion } from "framer-motion";

const { Option } = Select;

const TransactionsPage = () => {
  const { data, isLoading, isError } = useTransactions();
  const transactions = useMemo(() => data, [data]);
  const [filter, setFilter] = useState("all");

  console.log("transaction", transactions);
  if (isLoading)
    return <Spin className="flex justify-center items-center min-h-screen" />;
  if (isError)
    return <Alert message="Error loading transactions" type="error" showIcon />;

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((tx) => tx.paymentStatus === filter);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => `${record.currency || "INR"} ${amount}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => method || "N/A",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        let color =
          status === "success"
            ? "green"
            : status === "failed"
            ? "red"
            : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-6xl mx-auto bg-slate-100"
    >
      <Card className="p-6 shadow-md border rounded-2xl ">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

        {/* Filter Dropdown */}
        <Select
          defaultValue="all"
          style={{ width: 200, marginBottom: 16 }}
          onChange={(value) => setFilter(value)}
        >
          <Option value="all">All Transactions</Option>
          <Option value="success">Success</Option>
          <Option value="failed">Failed</Option>
          <Option value="pending">Pending</Option>
        </Select>

        {/* Transactions Table */}
        <Table
          className="overflow-x-auto "
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="orderId"
          bordered
          pagination={{ pageSize: 8 }}
          responsive={true}
        />
      </Card>
    </motion.div>
  );
};

export default TransactionsPage;
