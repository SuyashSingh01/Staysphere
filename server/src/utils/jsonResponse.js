export const JsonResponse = (res, body) => {
  res.status(body.status);
  res.send({
    status: body.status,
    success: body.success,
    title: body.title,
    message: body.message,
    data: body.data,
    extraData: body.extraData,
    error: body.error,
  });
};
