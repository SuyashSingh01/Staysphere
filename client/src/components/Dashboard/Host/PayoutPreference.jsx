import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  BanknoteIcon as Bank,
  ShoppingCartIcon as Paypal,
} from "lucide-react";
import { Button } from "./../../../components/common/ui/button";
import { Input } from "./../../../components/common/ui/input";
import { Label } from "./../../../components/common/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "./../../../components/common/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../../components/common/ui/select";
const HostPayoutPreference = () => {
  const [payoutMethod, setPayoutMethod] = useState("bank");
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-2xl font-bold mb-6" variants={itemVariants}>
          Set Your Payout Preference
        </motion.h1>

        <motion.div variants={itemVariants}>
          <RadioGroup
            value={payoutMethod}
            onValueChange={setPayoutMethod}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div>
              <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
              <Label
                htmlFor="bank"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Bank className="mb-3 h-6 w-6" />
                Bank
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="paypal"
                id="paypal"
                className="peer sr-only"
              />
              <Label
                htmlFor="paypal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Paypal className="mb-3 h-6 w-6" />
                PayPal
              </Label>
            </div>
            <div>
              <RadioGroupItem value="card" id="card" className="peer sr-only" />
              <Label
                htmlFor="card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                Card
              </Label>
            </div>
          </RadioGroup>
        </motion.div>

        {payoutMethod === "bank" && (
          <motion.div variants={itemVariants}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="1234567890" />
              </div>
              <div>
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input id="routingNumber" placeholder="123456789" />
              </div>
            </div>
          </motion.div>
        )}

        {payoutMethod === "paypal" && (
          <motion.div variants={itemVariants}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  placeholder="johndoe@example.com"
                />
              </div>
            </div>
          </motion.div>
        )}

        {payoutMethod === "card" && (
          <motion.div variants={itemVariants}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="mt-6">
          <Label htmlFor="currency">Preferred Currency</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inr">INR</SelectItem>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="w-full">Save Payout Preference</Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(HostPayoutPreference);
