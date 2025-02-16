import React from "react";
import { Form, Input, Button, Card, Alert, Collapse, Spin } from "antd";
import { motion } from "framer-motion";
import { useSubmitSupport } from "../../hooks/useMutateSubmitSupport";

const { TextArea } = Input;
const { Panel } = Collapse;

const ContactSupportPage = () => {
  const [form] = Form.useForm();
  const { mutate, isLoading, isSuccess, isError } = useSubmitSupport();

  const handleSubmit = (values) => {
    mutate(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 0, y: -20 }}
      animate={{ opacity: 1, x: 10, y: 20 }}
      transition={{ duration: 0.4 }}
      className="p-6 max-w-4xl mx-auto bg-white"
    >
      <Card className="p-6 shadow-md border rounded-2xl bg-white ">
        <h2 className="text-2xl font-bold mb-4">
          Contact & Support Team{" "}
          <strong className="text-orange-500">Staysphere</strong>
        </h2>
        <p className="text-gray-600 mb-6">
          Need help? Fill out the form below or check our FAQ section.
        </p>

        {isSuccess && (
          <Alert
            message="Success"
            description="Your message has been sent. We will get back to you soon!"
            type="success"
            showIcon
            className="mb-4"
          />
        )}
        {isError && (
          <Alert
            message="Error"
            description="Something went wrong. Please try again."
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Your Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please enter your message" }]}
          >
            <TextArea rows={4} placeholder="Type your message..." />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-orange-500"
            disabled={isLoading}
          >
            {isLoading ? <Spin /> : "Submit"}
          </Button>
        </Form>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-6 p-6 shadow-md border rounded-2xl bg-white">
        <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
        <Collapse>
          <Panel header="How can I reset my password?" key="1">
            <p>Go to Settings &gt; Security &gt; Reset Password.</p>
          </Panel>
          <Panel header="How do I cancel a booking?" key="2">
            <p>Navigate to My Bookings &gt; Select Booking &gt; Cancel.</p>
          </Panel>
          <Panel header="How can I contact customer support?" key="3">
            <p>
              You can use this contact form or email us at
              support@staysphere.com.
            </p>
          </Panel>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default ContactSupportPage;
