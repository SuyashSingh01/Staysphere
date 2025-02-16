import { Form, notification, Select } from "antd";
import Spinner from "../components/common/Spinner.jsx";
import Perks from "../components/PlaceDetail/Perks.jsx";
import React, { useEffect, useMemo, memo, useState } from "react";
import PerksWidget from "../components/common/PerksWidget.jsx";
import { useNavigate, useParams } from "react-router-dom";
import MultiplePhotosUploader from "../components/common/MultiplePhotosUploader.jsx";
import { types } from "../data/categories.js";
import {
  useAddPlace,
  usePlaceDetails,
  useUpdatePlace,
} from "../hooks/host/useMutationAddPlace.js";
import { Controller, useForm } from "react-hook-form";
import { LoadingSpinner } from "../components/Wrapper/PageWrapper.jsx";

const HostPlacesFormPage = () => {
  const navigate = useNavigate();
  const { placeId } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      address: "",
      description: "",
      perks: [],
      extraInfo: "",
      maxGuests: "",
      price: "",
      type: "",
    },
  });

  const [fileList, setFileList] = useState([]);

  const { data: placeData, isLoading } = usePlaceDetails(placeId);
  const initialplaceData = useMemo(() => {
    return placeData?.data.data;
  }, [placeData]);

  console.log("placeData", initialplaceData);
  const addPlaceMutation = useAddPlace();
  const updatePlaceMutation = useUpdatePlace();
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (placeId && placeData) {
    useEffect(() => {
      reset({
        title: initialplaceData?.placeName || "",
        address: initialplaceData?.placeLocation || "",
        description: initialplaceData?.description || "",
        perks: initialplaceData?.amenities ?? [],
        extraInfo: initialplaceData?.rules || "",
        maxGuests: initialplaceData?.maxGuests || "",
        price: initialplaceData?.price || "",
        type: initialplaceData?.type || "",
      });
      if (initialplaceData?.image) {
        const formattedFileList = initialplaceData.image.map((url, index) => ({
          uid: `${index}`,
          name: `Photo ${index + 1}`,
          status: "done",
          url: url, // Ant Design needs "url" for previewing images
        }));
        setFileList(formattedFileList);
      }
    }, [placeData, reset, placeId]);
  }
  const perks = watch("perks");

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "perks") {
        formData.append(key, JSON.stringify(value)); // Convert perks array to string
      } else {
        formData.append(key, value);
      }
    });
    // Handle image files properly
    const imageFiles = await Promise.all(
      fileList.map(async (file) => {
        if (file.originFileObj instanceof File) {
          return file.originFileObj; // New uploaded file
        } else if (typeof file.url === "string") {
          return file.url; // Existing Cloudinary URL
        } else {
          console.warn("Skipping invalid file:", file);
          return null;
        }
      })
    );
    console.log(imageFiles);
    // Append only valid images
    imageFiles.forEach((file) => {
      if (file) formData.append("images", file);
      console.log("uploaded", file);
    });

    // fileList.forEach((file) => {
    //   formData.append("images", file.url || file);
    // });
    // fileList.forEach((file) => {
    //   if (file.originFileObj) {
    //     formData.append("images", file.originFileObj); // Append File object, not URL
    //   } else {
    //     // formData.append("images", file); // Ensure actual File objects are sent
    //   }
    // });
    console.log("FILELIS", fileList);
    // for (const pair of formData.entries()) {
    //   console.log("HU", pair[0], pair[1]); // Should log actual files, not "[object Object]"
    // }

    // Debugging Log
    console.log("Submitting FormData:", Object.fromEntries(formData.entries()));

    if (placeId) {
      console.log("Submitting for updation", placeId, formData);
      await updatePlaceMutation.mutateAsync(
        { placeId, updatedData: formData },
        {
          onSuccess: () => {
            notification.success({
              message: "Place updated successfully!",
              duration: 1,
            });
            navigate("/account/places");
          },
          onError: () => {
            notification.error({ message: "Failed to update place!" });
          },
        }
      );
    } else {
      addPlaceMutation.mutate(formData, {
        onSuccess: () => {
          notification.success({
            message: "Place added successfully!",
            duration: 1,
          });
          navigate("/account/places");
        },
        onError: () => {
          notification.error({ message: "Failed to add place!" });
        },
      });
    }
  };

  const label = (header, description) => (
    <>
      <h2 className="mt-4 text-2xl">{header}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </>
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center bg-gray-100 mx-auto md:p-2 lg:p-4 p-1">
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        className="mx-4"
      >
        {label("Title", "Title for your place. Should be catchy.")}
        <input
          {...register("title", { required: "Title is required" })}
          type="text"
          placeholder="e.g. Cozy Apartment"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {label("Address", "Address to this place")}
        <input
          {...register("address", { required: "Address is required" })}
          type="text"
          placeholder="Address"
        />
        {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
        )}

        {label("Photos", "Upload the pictures of your place")}
        <MultiplePhotosUploader fileList={fileList} setFileList={setFileList} />

        {label("Perks", "Select all the perks of your place")}
        <PerksWidget
          selected={watch("perks") || []}
          handleFormData={(e) => {
            const name = e.target.name;
            setValue(
              "perks",
              perks.includes(name)
                ? perks.filter((p) => p !== name)
                : [...perks, name]
            );
          }}
        />
        <Perks
          perks={perks}
          handleFormData={(e) => {
            const name = e.target.name;
            setValue(
              "perks",
              perks.includes(name)
                ? perks.filter((p) => p !== name)
                : [...perks, name]
            );
          }}
        />
        {label("Type", "Select the type of your place")}
        <Form.Item
          validateStatus={errors.type ? "error" : ""}
          help={errors.type ? errors.type.message : ""}
          className="mt-4 "
        >
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

        {label("Description", "Tell us more about your place")}
        <textarea {...register("description")} />

        {label(
          "Guests & Price",
          "Specify the maximum guests and price per night"
        )}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Max no. of guests</h3>
            <input
              {...register("maxGuests", {
                required: "Max guests is required",
                min: { value: 1, message: "At least 1 guest required" },
              })}
              type="number"
              placeholder="1"
            />
            {errors.maxGuests && (
              <p className="text-red-500">{errors.maxGuests.message}</p>
            )}
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              {...register("price", {
                required: "Price is required",
                min: { value: 1, message: "Minimum price is 1" },
              })}
              type="number"
              placeholder="1"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>
        </div>

        {label("Extra info", "House rules, etc.")}
        <textarea {...register("extraInfo")} />

        <button
          className="mx-auto my-4 flex rounded-full bg-orange-400 py-3 px-20 text-xl font-semibold text-white active:bg-orange-500"
          type="submit"
        >
          {placeId
            ? isLoading
              ? "Updating..."
              : "Update"
            : isLoading
            ? "Saving..."
            : "Save"}
        </button>
      </form>
    </div>
  );
};

export default memo(HostPlacesFormPage);
