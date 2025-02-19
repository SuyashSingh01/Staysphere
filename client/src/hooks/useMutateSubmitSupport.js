import { useMutation } from "@tanstack/react-query";
import { request } from "../services/apiConnector";
import { contactUsApis } from "../services/api.urls";

const submitSupportRequest = async (formdata) => {
  const { data } = await request(
    "POST",
    contactUsApis.SUBMIT_CONTACT_API,
    formdata
  );
  return data.data;
};

export const useSubmitSupport = () => {
  return useMutation({
    mutationFn: submitSupportRequest,
  });
};
