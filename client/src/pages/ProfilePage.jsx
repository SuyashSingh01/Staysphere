import React, { memo, useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Stack,
  Select,
  Option,
  Typography,
  Card,
  CardActions,
  CardOverflow,
  Textarea,
} from "@mui/joy";
import { useSelector } from "react-redux";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "");
  const [role, setRole] = useState("Host");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [profileImage, setProfileImage] = useState(
    user?.profilepic ??
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
  );
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfileImage(fileURL);
      setSelectedFile(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      name: `${firstName} ${lastName}`,
      role,
      email,
      phone,
      bio,
      address,
      website,
      profileImage: selectedFile || profileImage,
    };
    console.log("Updated Profile:", updatedProfile);
  };

  return (
    <Box className="flex justify-center py-10 px-5">
      <Card className="max-w-3xl w-full p-6 shadow-xl rounded-lg">
        <Typography level="h5" className="mb-1 font-bold">
          Personal Info
        </Typography>
        <Typography level="body-sm" className="mb-4 text-gray-600">
          Customize your profile details for better visibility on Staysphere.
        </Typography>
        <Divider />
        <Stack className="mt-4" spacing={4}>
          <Box className="flex flex-col items-center">
            <AspectRatio
              ratio="1"
              className="w-32 h-32 rounded-full overflow-hidden"
            >
              <img src={profileImage} alt="Profile" loading="lazy" />
            </AspectRatio>
            <IconButton component="label" className="mt-2">
              <EditRoundedIcon />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleUpload}
              />
            </IconButton>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
          </Stack>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              disabled
              startDecorator={<EmailRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              startDecorator={<PhoneRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write about yourself..."
            />
          </FormControl>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              startDecorator={<HomeRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              startDecorator={<LinkRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Timezone</FormLabel>
            <Select
              startDecorator={<AccessTimeFilledRoundedIcon />}
              defaultValue="1"
            >
              <Option value="1">India Time — GMT+05:30</Option>
              <Option value="2">USA (New York) — GMT-05:00</Option>
            </Select>
          </FormControl>
        </Stack>
        <CardOverflow className="mt-4 border-t pt-4">
          <CardActions className="flex justify-end">
            <Button variant="outlined">Cancel</Button>
            <Button variant="solid" onClick={handleSave}>
              Save
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Box>
  );
}

export default memo(ProfilePage);
