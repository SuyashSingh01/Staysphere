import React, { memo, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useProfile, useUpdateProfile } from "../hooks/useProfileDetail";
import { setProfileData } from "../Redux/slices/ProfileSlice";
import { FaGenderless } from "react-icons/fa";
import { BsGenderAmbiguous } from "react-icons/bs";

const ProfilePage = () => {
  const { profilePic } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      // dispatch(setProfileData(profile));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("Form Data:", formData);
  };

  const handleSave = () => {
    console.log("Form Data:-", formData);
    updateProfileMutation.mutate(formData);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(
    profilePic ??
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
  );
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfileImage(fileURL);
      setSelectedFile(file);
    }
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
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name || user.name}
                onChange={handleInputChange}
              />
            </FormControl>
          </Stack>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={formData.email || user.email}
              disabled
              startDecorator={<EmailRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={formData.phone}
              onChange={handleInputChange}
              startDecorator={<PhoneRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Input value={user.role} disabled />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write about yourself..."
            />
          </FormControl>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              value={formData.address}
              onChange={handleInputChange}
              startDecorator={<HomeRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <Select
              startDecorator={<BsGenderAmbiguous />}
              defaultValue="male"
              onChange={handleInputChange}
            >
              <Option value={"male"}>Male</Option>
              <Option value={"female"}>Female</Option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Input
              value={formData.country}
              onChange={handleInputChange}
              startDecorator={<AccessTimeFilledRoundedIcon />}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              value={formData.dateofBirth}
              onChange={handleInputChange}
              type="date"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input
              value={formData.website}
              onChange={handleInputChange}
              startDecorator={<LinkRoundedIcon />}
            />
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
};

export default memo(ProfilePage);
