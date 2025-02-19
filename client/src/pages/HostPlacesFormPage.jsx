import { useState, useEffect, memo } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  notification,
  InputNumber,
  Card,
  Typography,
  Steps,
  Checkbox,
  DatePicker,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  useAddPlace,
  usePlaceDetails,
  useUpdatePlace,
} from "../hooks/host/useMutationAddPlace";
import moment from "moment";
import Spinner from "../components/common/Spinner";
import MultiplePhotosUploader from "../components/common/MultiplePhotosUploader";
import { types } from "../data/categories";

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const perksOptions = [
  "WiFi",
  "Kitchen",
  "Free Parking",
  "Air Conditioning",
  "Pool",
];

const HostPlaceFormPage = () => {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);

  // Initialize React Hook Form with default values
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      address: "",
      description: "",
      perks: [],
      extraInfo: "",
      maxGuests: 1,
      price: 100,
      type: "",
      availability: null,
    },
  });

  const perks = watch("perks");

  // Fetch existing place details if editing
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
        maxGuests: initialData.maxGuests || 1,
        price: initialData.price || 100,
        type: initialData.type || "",
        availability: initialData.availability
          ? moment(initialData.availability)
          : null,
        perks: initialData.amenities || [],
        extraInfo: initialData.rules || "",
      });
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

  if (isLoading) return <Spinner />;

  // Submission handler
  const onSubmit = async (formData) => {
    const preparedData = new FormData();

    // Append image files: new files and existing image URLs
    fileList.forEach((file) => {
      if (file.originFileObj) {
        preparedData.append("images", file.originFileObj);
      } else if (file.url) {
        preparedData.append("existingImages", file.url);
      }
    });

    // Append other form fields (format dates if necessary)
    Object.entries(formData).forEach(([key, value]) => {
      if (moment.isMoment(value)) {
        preparedData.append(key, value.format("YYYY-MM-DD"));
      } else {
        preparedData.append(key, value);
      }
    });

    try {
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
    } catch (error) {
      console.error(error);
      notification.error({ message: error.message });
    }
  };

  // Step navigation functions
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <Title level={3} className="text-center mb-4 font-bold">
          Host Your Place
        </Title>
        <Text className="block text-gray-500 text-center mb-6">
          List your place with ease. Fill in the details below.
        </Text>

        {/* Multi-step Progress Indicator */}
        <Steps current={currentStep} className="mb-6">
          <Step title="Basic Info" />
          <Step title="Details" />
          <Step title="Photos & Pricing" />
        </Steps>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                label="Title"
                validateStatus={errors.title ? "error" : ""}
                help={errors.title?.message}
              >
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter place title" />
                  )}
                />
              </Form.Item>
              <Form.Item
                label="Address"
                validateStatus={errors.address ? "error" : ""}
                help={errors.address?.message}
              >
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter address" />
                  )}
                />
              </Form.Item>
            </>
          )}
          {currentStep === 1 && (
            <>
              <Form.Item label="Perks">
                <Controller
                  name="perks"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Group {...field} options={perksOptions} />
                  )}
                />
              </Form.Item>
              <Form.Item label="Description">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder="Tell us more about your place"
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                label="Max Guests"
                validateStatus={errors.maxGuests ? "error" : ""}
                help={errors.maxGuests?.message}
              >
                <Controller
                  name="maxGuests"
                  control={control}
                  rules={{
                    required: "Max guests is required",
                    min: { value: 1, message: "At least 1 guest required" },
                  }}
                  render={({ field }) => <InputNumber {...field} min={1} />}
                />
              </Form.Item>
              <Form.Item
                label="Type"
                validateStatus={errors.type ? "error" : ""}
                help={errors.type?.message}
              >
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <Select {...field} placeholder="Select type">
                      {types.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Form.Item>
            </>
          )}
          {currentStep === 2 && (
            <>
              <Form.Item label="Upload Photos">
                <MultiplePhotosUploader
                  fileList={fileList}
                  setFileList={setFileList}
                />
              </Form.Item>
              <Form.Item
                label="Price per Night"
                validateStatus={errors.price ? "error" : ""}
                help={errors.price?.message}
              >
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Price is required",
                    min: { value: 1, message: "Minimum price is 1" },
                  }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={1}
                      formatter={(value) => `$ ${value}`}
                    />
                  )}
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
              <Form.Item label="Extra Info">
                <Controller
                  name="extraInfo"
                  control={control}
                  render={({ field }) => (
                    <Input.TextArea
                      {...field}
                      placeholder="House rules, etc."
                    />
                  )}
                />
              </Form.Item>
            </>
          )}
          <div className="flex justify-between mt-4">
            {currentStep > 0 && <Button onClick={prevStep}>Back</Button>}
            {currentStep < 2 ? (
              <Button type="primary" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};
export default memo(HostPlaceFormPage);
