import notification from "../../assets/notification.svg";

const Notification = () => {
  return (
    <div className="xl:px-20 lg:px-10 sm:px-10 px-6 py-10">
      <div className="flex justify-center h-screen">
        <div className="mt-20 w-[90%] flex flex-col items-center ">
          <img className="w-10" src={notification} alt="message_icon" />
          <h2 className="text-lg mt-6 font-semibold text-center">
            You don{"'"}t have any Notification
          </h2>
          <p className="text-center text-gray-600">
            When you receive a new Notification, it will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
