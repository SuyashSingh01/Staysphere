import React from "react";
import { Card, Table, Button, Statistic, Row, Col, Spin } from "antd";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  useEarnings,
  useRequestPayout,
} from "../../../hooks/host/useQueryEarning";

const COLORS = ["#00C49F", "#FFBB28", "#FF4848"];

const HostEarnings = () => {
  const { data, isLoading } = useEarnings();
  const { mutate, isPending } = useRequestPayout();

  if (isLoading) return <Spin />;

  const { totalEarnings, pending, success, failed, bookings } = data;

  const chartData = [
    { name: "Paid", value: success },
    { name: "Pending", value: pending },
    { name: "Failed", value: failed },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Earnings Overview */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Earnings" value={`$${totalEarnings}`} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pending Payments" value={`$${pending}`} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Failed Payments" value={`$${failed}`} />
          </Card>
        </Col>
      </Row>

      {/* Earnings Chart */}
      <Card title="Earnings Breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Booking Transactions */}
      <Card title="Booking Transactions">
        <Table
          dataSource={bookings}
          columns={[
            { title: "Booking ID", dataIndex: "orderId", key: "orderId" },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              render: (amt) => `$${amt}`,
            },
            { title: "Status", dataIndex: "paymentStatus", key: "status" },
            { title: "Method", dataIndex: "paymentMethod", key: "method" },
          ]}
        />
      </Card>

      {/* Request Payout */}
      <Button type="primary" onClick={() => mutate()} loading={isPending}>
        Request Payout
      </Button>
    </div>
  );
};

export default HostEarnings;
