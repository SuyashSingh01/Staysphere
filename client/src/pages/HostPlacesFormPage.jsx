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
  Divider,
  Tag,
  Tooltip,
  Modal,
  Empty,
  message,
  Space,
  Row,
  Col,
} from "antd";
import {
  HomeOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TeamOutlined,
  TagOutlined,
} from "@ant-design/icons";
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
import { perksOptions } from "../data/filterSectionAmenities";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const HostPlaceFormPage = () => {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [imageEditMode, setImageEditMode] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(!!placeId);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
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
  const title = watch("title");

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

  const handleImageEdit = (index) => {
    setEditingImageIndex(index);
    setImageUrl(fileList[index]?.url || "");
    setIsModalVisible(true);
  };

  const handleImageUrlSave = () => {
    if (!imageUrl.trim()) {
      message.error("Please enter a valid image URL");
      return;
    }

    const newFileList = [...fileList];

    if (editingImageIndex !== null) {
      newFileList[editingImageIndex] = {
        uid: `url-${editingImageIndex}`,
        name: `Photo ${editingImageIndex + 1}`,
        status: "done",
        url: imageUrl,
      };
    } else {
      newFileList.push({
        uid: `url-${fileList.length}`,
        name: `Photo ${fileList.length + 1}`,
        status: "done",
        url: imageUrl,
      });
    }

    setFileList(newFileList);
    setIsModalVisible(false);
    setImageUrl("");
    setEditingImageIndex(null);
  };

  const handleImageDelete = (index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this image?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        const newFileList = [...fileList];
        newFileList.splice(index, 1);
        setFileList(newFileList);
        message.success("Image deleted successfully");
      },
    });
  };

  const onSubmit = async (formData) => {
    if (fileList.length === 0) {
      message.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    const preparedData = new FormData();

    fileList.forEach((file) => {
      if (file.originFileObj) {
        preparedData.append("images", file.originFileObj);
      } else if (file.url) {
        preparedData.append("existingImages", file.url);
      }
    });

    Object.entries(formData).forEach(([key, value]) => {
      if (moment.isMoment(value)) {
        preparedData.append(key, value.format("YYYY-MM-DD"));
      } else if (Array.isArray(value)) {
        preparedData.append(key, JSON.stringify(value));
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
              notification.success({
                message: "Success!",
                description: "Your place has been updated successfully!",
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
              });
              navigate("/account/places");
            },
            onError: (error) =>
              notification.error({
                message: "Update failed!",
                description:
                  error.message || "There was an error updating your place.",
              }),
          }
        );
      } else {
        addPlaceMutation.mutate(preparedData, {
          onSuccess: () => {
            notification.success({
              message: "Success!",
              description: "Your place has been added successfully!",
              icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            });
            navigate("/account/places");
          },
          onError: (error) =>
            notification.error({
              message: "Addition failed!",
              description:
                error.message || "There was an error adding your place.",
            }),
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!watch("title") || !watch("address")) {
        message.error("Please fill in all required fields");
        return false;
      }
    } else if (currentStep === 1) {
      if (!watch("type") || !watch("maxGuests")) {
        message.error("Please fill in all required fields");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <Card
        className="w-full max-w-4xl rounded-xl shadow-xl p-10"
        bordered={false}
        style={{
          background: "linear-gradient(to right bottom, #ffffff, #f8f9fa)",
          borderRadius: "16px",
        }}
      >
        <div className="text-center mb-8">
          <Title level={2} style={{ fontWeight: "600", color: "#1a1a1a" }}>
            {placeId ? "Edit Your Place" : "Host Your Place"}
          </Title>
          <Text className="text-gray-500 text-lg">
            {placeId
              ? "Update your listing details to attract more guests"
              : "Share your space and start earning"}
          </Text>
        </div>

        {isEditing && title && (
          <Card
            className="mb-6 overflow-hidden rounded-md mt-10"
            cover={
              fileList.length > 0 && (
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    alt={title}
                    src={fileList[0]?.url || "/placeholder-image.jpg"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              )
            }
          >
            <Card.Meta
              title={
                <Text strong style={{ fontSize: "18px" }}>
                  {title}
                </Text>
              }
              description={
                <Space direction="vertical" size="small">
                  <Text type="secondary">
                    <EnvironmentOutlined /> {watch("address")}
                  </Text>
                  {watch("type") && (
                    <Tag color="blue">
                      <TagOutlined /> {watch("type")}
                    </Tag>
                  )}
                  {watch("price") && (
                    <Text type="success">
                      <DollarOutlined /> ${watch("price")} per night
                    </Text>
                  )}
                </Space>
              }
            />
          </Card>
        )}

        <Steps
          current={currentStep}
          className="mb-8"
          responsive={true}
          style={{ marginBottom: "2rem" }}
        >
          <Step
            title="Basic Info"
            icon={<HomeOutlined />}
            description="Location & title"
          />
          <Step
            title="Details"
            icon={<InfoCircleOutlined />}
            description="Features & capacity"
          />
          <Step
            title="Photos & Pricing"
            icon={<PictureOutlined />}
            description="Images & rates"
          />
        </Steps>

        <Form
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
          className="space-y-6"
          requiredMark="optional"
        >
          {currentStep === 0 && (
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      Title <Text type="danger">*</Text>
                    </span>
                  }
                  validateStatus={errors.title ? "error" : ""}
                  help={errors.title?.message}
                  tooltip="A catchy title will attract more guests"
                >
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Cozy apartment in downtown"
                        size="large"
                        prefix={<HomeOutlined className="text-gray-400" />}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      Address <Text type="danger">*</Text>
                    </span>
                  }
                  validateStatus={errors.address ? "error" : ""}
                  help={errors.address?.message}
                  tooltip="Enter the full address of your property"
                >
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="123 Main St, City, Country"
                        size="large"
                        prefix={
                          <EnvironmentOutlined className="text-gray-400" />
                        }
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item
                label={<span className="text-base font-medium">Amenities</span>}
                tooltip="Select all amenities available at your property"
              >
                <Controller
                  name="perks"
                  control={control}
                  render={({ field }) => (
                    <Checkbox.Group {...field} className="w-full">
                      <Row gutter={[16, 16]}>
                        {perksOptions.map((perk) => (
                          <Col span={8} key={perk.value}>
                            <Checkbox
                              value={perk.value}
                              className="perk-checkbox"
                            >
                              <Space>{perk.label}</Space>
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  )}
                />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span className="text-base font-medium">
                        Property Type <Text type="danger">*</Text>
                      </span>
                    }
                    validateStatus={errors.type ? "error" : ""}
                    help={errors.type?.message}
                    tooltip="Select the type that best describes your property"
                  >
                    <Controller
                      name="type"
                      control={control}
                      rules={{ required: "Type is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select property type"
                          size="large"
                          style={{ width: "100%" }}
                        >
                          {types.map((type) => (
                            <Option key={type} value={type}>
                              {type}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span className="text-base font-medium">
                        Max Guests <Text type="danger">*</Text>
                      </span>
                    }
                    validateStatus={errors.maxGuests ? "error" : ""}
                    help={errors.maxGuests?.message}
                    tooltip="Maximum number of guests allowed"
                  >
                    <Controller
                      name="maxGuests"
                      control={control}
                      rules={{
                        required: "Max guests is required",
                        min: { value: 1, message: "At least 1 guest required" },
                      }}
                      render={({ field }) => (
                        <InputNumber
                          {...field}
                          min={1}
                          size="large"
                          style={{ width: "100%" }}
                          prefix={<TeamOutlined className="text-gray-400" />}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <span className="text-base font-medium">Description</span>
                }
                tooltip="Describe your place in detail to attract guests"
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      placeholder="Tell potential guests what makes your place special..."
                      autoSize={{ minRows: 4, maxRows: 8 }}
                      showCount
                      maxLength={1000}
                    />
                  )}
                />
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Form.Item
                label={
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium">Photos</span>
                    <Space>
                      <Button
                        type="link"
                        onClick={() => setImageEditMode(!imageEditMode)}
                        icon={<EditOutlined />}
                      >
                        {imageEditMode ? "Done Editing" : "Edit Images"}
                      </Button>
                      <Button
                        type="link"
                        onClick={() => {
                          setEditingImageIndex(null);
                          setIsModalVisible(true);
                        }}
                        icon={<PlusOutlined />}
                      >
                        Add by URL
                      </Button>
                    </Space>
                  </div>
                }
                tooltip="High-quality photos increase booking rates"
              >
                {imageEditMode ? (
                  <div className="image-gallery">
                    <Row gutter={[16, 16]}>
                      {fileList.map((file, index) => (
                        <Col xs={24} sm={12} md={8} key={file.uid || index}>
                          <Card
                            hoverable
                            cover={
                              <div
                                style={{
                                  height: "150px",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <img
                                  alt={`${index + 1}`}
                                  src={
                                    file.url ||
                                    URL.createObjectURL(file.originFileObj)
                                  }
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  className="image-actions"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    padding: "8px",
                                    background: "rgba(0,0,0,0.5)",
                                    borderRadius: "0 0 0 8px",
                                  }}
                                >
                                  <Space>
                                    <Button
                                      type="text"
                                      icon={
                                        <EditOutlined
                                          style={{ color: "white" }}
                                        />
                                      }
                                      onClick={() => handleImageEdit(index)}
                                      size="small"
                                    />
                                    <Button
                                      type="text"
                                      danger
                                      icon={
                                        <DeleteOutlined
                                          style={{ color: "white" }}
                                        />
                                      }
                                      onClick={() => handleImageDelete(index)}
                                      size="small"
                                    />
                                  </Space>
                                </div>
                              </div>
                            }
                          >
                            <Card.Meta
                              title={`Photo ${index + 1}`}
                              description={
                                file.url ? "External URL" : "Uploaded file"
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                      {fileList.length === 0 && (
                        <Col span={24}>
                          <Empty
                            description="No images added yet"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        </Col>
                      )}
                    </Row>
                  </div>
                ) : (
                  <MultiplePhotosUploader
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                )}
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span className="text-base font-medium">
                        Price per Night <Text type="danger">*</Text>
                      </span>
                    }
                    validateStatus={errors.price ? "error" : ""}
                    help={errors.price?.message}
                    tooltip="Set a competitive price to attract bookings"
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
                          size="large"
                          style={{ width: "100%" }}
                          formatter={(value) => `$ ${value}`}
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          prefix={<DollarOutlined className="text-gray-400" />}
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span className="text-base font-medium">
                        Availability Start Date
                      </span>
                    }
                    tooltip="When will your place be available for booking?"
                  >
                    <Controller
                      name="availability"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          format="YYYY-MM-DD"
                          size="large"
                          style={{ width: "100%" }}
                          disabledDate={(current) =>
                            current && current < moment().startOf("day")
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={
                  <span className="text-base font-medium">
                    House Rules & Extra Info
                  </span>
                }
                tooltip="Provide any additional information guests should know"
              >
                <Controller
                  name="extraInfo"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      placeholder="Check-in procedures, house rules, nearby attractions..."
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      showCount
                      maxLength={500}
                    />
                  )}
                />
              </Form.Item>
            </>
          )}

          <Divider style={{ margin: "24px 0" }} />

          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button
                onClick={prevStep}
                size="large"
                style={{ minWidth: "100px" }}
              >
                Back
              </Button>
            )}
            {currentStep < 2 ? (
              <Button
                type="primary"
                onClick={handleNext}
                size="large"
                style={{ minWidth: "100px", marginLeft: "auto" }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isSubmitting}
                style={{ minWidth: "120px", marginLeft: "auto" }}
              >
                {placeId ? "Update Place" : "List My Place"}
              </Button>
            )}
          </div>
        </Form>

        <Modal
          title={
            editingImageIndex !== null ? "Edit Image URL" : "Add Image by URL"
          }
          open={isModalVisible}
          onOk={handleImageUrlSave}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingImageIndex(null);
            setImageUrl("");
          }}
          okText={editingImageIndex !== null ? "Update" : "Add"}
        >
          <Form layout="vertical">
            <Form.Item
              label="Image URL"
              required
              tooltip="Enter a direct link to an image (JPG, PNG, etc.)"
            >
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                suffix={
                  <Tooltip title="Make sure the URL points directly to an image file">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                }
              />
            </Form.Item>
            {imageUrl && (
              <div className="mt-4 text-center">
                <p className="mb-2">Preview:</p>
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-error.jpg";
                    message.error("Invalid image URL. Please check the link.");
                  }}
                />
              </div>
            )}
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default memo(HostPlaceFormPage);
