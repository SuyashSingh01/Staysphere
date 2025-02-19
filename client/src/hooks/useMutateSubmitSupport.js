import { useMutation } from "@tanstack/react-query";
import { request } from "../services/apiConnector";

const submitSupportRequest = async (formdata) => {
  const { data } = await request(
    "POST",
    contactusEndpoint.SUBMIT_CONTACT_API,
    formdata
  );
  return data.data;
};

export const useSubmitSupport = () => {
  return useMutation({
    mutationFn: submitSupportRequest,
  });
};
