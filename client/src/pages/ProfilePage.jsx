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
} from "@mui/joy";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useSelector } from "react-redux";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "");
  const [role, setRole] = useState("Host");
  const [email, setEmail] = useState(user?.email ?? "");
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
      profileImage: selectedFile || profileImage,
    };
    // dispatch the changes to the store  or API
    console.log("Updated Profile:", updatedProfile);
  };

  return (
    <Box
      sx={{ flex: 1, width: "100%", marginTop: "30px", marginBottom: "30px" }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 2, sm: 4, md: 5 },
        }}
      >
        <Card sx={{ p: 3, flexGrow: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography level="title-md">Personal info</Typography>
            <Typography level="body-sm">
              Customize how your profile information will appear to the
              networks.
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mt: 2 }}
          >
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{
                  flex: 1,
                  minWidth: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img src={profileImage} alt="Profile" loading="lazy" />
              </AspectRatio>
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  position: "absolute",
                  zIndex: 2,
                  right: "25%",
                  bottom: "5%",
                  transform: "translateX(50%)",
                  boxShadow: "sm",
                }}
                component="label"
              >
                <EditRoundedIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleUpload}
                />
              </IconButton>
            </Box>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Input
                    size="sm"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    size="sm"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Stack>
              </FormControl>
              <FormControl>
                <FormLabel>Primary Email</FormLabel>
                <Input
                  size="sm"
                  placeholder="Email"
                  value={email}
                  disabled
                  startDecorator={<EmailRoundedIcon />}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input
                  size="sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter role"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Timezone</FormLabel>
                <Select
                  size="sm"
                  startDecorator={<AccessTimeFilledRoundedIcon />}
                  defaultValue="1"
                >
                  <Option value="1">India Time — GMT+05:30</Option>
                  <Option value="2">USA (New York) — GMT-05:00</Option>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ justifyContent: "flex-end", pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid" onClick={handleSave}>
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
}

export default memo(ProfilePage);
