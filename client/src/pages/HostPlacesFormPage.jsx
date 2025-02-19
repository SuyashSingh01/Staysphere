import {
  Form,
  Input,
  Button,
  Select,
  notification,
  DatePicker,
  InputNumber,
  Card,
  Typography,
} from "antd";
import { useEffect, useState, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddPlace,
  usePlaceDetails,
  useUpdatePlace,
} from "../hooks/host/useMutationAddPlace";
import { Controller, useForm } from "react-hook-form";
import MultiplePhotosUploader from "../components/common/MultiplePhotosUploader";
import PerksWidget from "../components/common/PerksWidget";
import { types } from "../data/categories";
import Spinner from "../components/common/Spinner";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import moment from "moment";

const { Title, Text } = Typography;

const HostPlacesFormPage = () => {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const [fileList, setFileList] = useState([]);
  const [location, setLocation] = useState(null);

  const { data: placeData, isLoading } = usePlaceDetails(placeId);
  const updatePlaceMutation = useUpdatePlace();
  const addPlaceMutation = useAddPlace();

  useEffect(() => {
    if (placeId && placeData?.status === 200) {
      const initialData = placeData.data.data;
      reset({
        title: initialData.placeName || "",
        address: initialData.placeLocation || "",
        description: initialData.description || "",
        perks: initialData.amenities || [],
        extraInfo: initialData.rules || "",
        maxGuests: initialData.maxGuests || "",
        price: initialData.price || "",
        type: initialData.type || "",
        availability: initialData.availability
          ? moment(initialData.availability)
          : null,
      });
      setLocation(initialData.placeLocation || "");
      setFileList(
        initialData.image?.map((url, index) => ({
          uid: `${index}`,
          name: `Photo ${index + 1}`,
          status: "done",
          url,
        })) || []
      );
    }
  }, [placeId, placeData, reset]);

  const onSubmit = async (formData) => {
    const preparedData = new FormData();
    fileList.forEach((file) => {
      if (file.originFileObj) {
        preparedData.append("images", file.originFileObj);
      } else {
        preparedData.append("existingImages", file.url);
      }
    });

    Object.entries(formData).forEach(([key, value]) =>
      preparedData.append(key, value)
    );
    preparedData.append("location", location?.label || "");

    if (placeId) {
      await updatePlaceMutation.mutateAsync(
        { placeId, updatedData: preparedData },
        {
          onSuccess: () => {
            notification.success({ message: "Place updated successfully!" });
            navigate("/account/places");
          },
          onError: () => notification.error({ message: "Update failed!" }),
        }
      );
    } else {
      addPlaceMutation.mutate(preparedData, {
        onSuccess: () => {
          notification.success({ message: "Place added successfully!" });
          navigate("/account/places");
        },
        onError: () => notification.error({ message: "Addition failed!" }),
      });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <Title level={3} className="text-center mb-4">
          Host Your Place
        </Title>
        <Text className="block text-gray-500 text-center mb-6">
          Fill in the details to list your place on our platform.
        </Text>

        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
          <Form.Item
            label="Title"
            validateStatus={errors.title ? "error" : ""}
            help={errors.title?.message}
          >
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="Cozy Apartment"
            />
          </Form.Item>

          <Form.Item label="Address">
            <GooglePlacesAutocomplete
              selectProps={{ location, onChange: setLocation }}
            />
          </Form.Item>

          <Form.Item label="Photos">
            <MultiplePhotosUploader
              fileList={fileList}
              setFileList={setFileList}
            />
          </Form.Item>

          <Form.Item label="Perks">
            <PerksWidget
              selected={watch("perks")}
              handleFormData={(e) =>
                setValue(
                  "perks",
                  e.target.checked
                    ? [...watch("perks"), e.target.name]
                    : watch("perks").filter((p) => p !== e.target.name)
                )
              }
            />
          </Form.Item>

          <Form.Item label="Type">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select type">
                  {types.map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input.TextArea
              {...register("description")}
              placeholder="Tell us more about your place"
            />
          </Form.Item>

          <Form.Item label="Max Guests">
            <InputNumber
              {...register("maxGuests", { required: "Required", min: 1 })}
              placeholder="1"
              min={1}
            />
          </Form.Item>

          <Form.Item label="Price per Night">
            <InputNumber
              {...register("price", { required: "Required", min: 1 })}
              placeholder="100"
              min={1}
              formatter={(value) => `$ ${value}`}
            />
          </Form.Item>

          <Form.Item label="Availability">
            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} format="YYYY-MM-DD" />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {placeId ? "Update" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default memo(HostPlacesFormPage);
