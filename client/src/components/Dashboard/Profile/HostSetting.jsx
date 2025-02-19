import React, { useState } from "react";
import { Card, Button, Divider, Input, Typography, Switch } from "@mui/joy";
import { Plus, CreditCard, Banknote, Home } from "lucide-react";
import { motion } from "framer-motion";
const HostSettings = () => {
  const [payoutMethod, setPayoutMethod] = useState("bank");
  const [hostedPlaces, setHostedPlaces] = useState([
    { id: 1, name: "Luxury Beach House", earnings: "$1,200" },
    { id: 2, name: "Cozy Mountain Cabin", earnings: "$850" },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto p-6 space-y-6"
    >
      {/* Hosted Places Section */}
      <Card className="p-4 shadow-md rounded-lg">
        <Typography level="h5" className="mb-3 flex items-center">
          <Home className="mr-2" /> Hosted Places
        </Typography>
        <Divider />
        <div className="space-y-4 mt-3">
          {hostedPlaces.map((place) => (
            <div key={place.id} className="flex justify-between items-center">
              <Typography>{place.name}</Typography>
              <Typography className="text-green-600 font-medium">
                {place.earnings}
              </Typography>
            </div>
          ))}
          <Button variant="outlined" startDecorator={<Plus />}>
            Add New Place
          </Button>
        </div>
      </Card>

      {/* Payment Settings Section */}
      <Card className="p-4 shadow-md rounded-lg">
        <Typography level="h5" className="mb-3 flex items-center">
          <CreditCard className="mr-2" /> Payment Settings
        </Typography>
        <Divider />
        <div className="mt-3 space-y-4">
          <div className="flex justify-between items-center">
            <Typography>Enable Auto Payouts</Typography>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-between items-center">
            <Typography>Select Payout Method</Typography>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="border rounded p-2"
            >
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          {payoutMethod === "bank" && (
            <Input
              placeholder="Enter Bank Account Details"
              startDecorator={<Banknote />}
            />
          )}
          {payoutMethod === "paypal" && (
            <Input
              placeholder="Enter PayPal Email"
              startDecorator={<EmailRoundedIcon />}
            />
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default HostSettings;
