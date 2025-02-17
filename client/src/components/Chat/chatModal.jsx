import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOpenChat,
  setChatSize,
  setChatPosition,
} from "../../Redux/slices/chatSlice";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { motion, AnimatePresence } from "framer-motion";
import Chat from "./Chat";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ChatModal = ({ userId, hostId }) => {
  console.log("Chat modal userid", userId, "-  hostid", hostId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openChat, size, position } = useSelector((state) => state.chat);
  const draggleRef = useRef(null);

  return (
    <AnimatePresence>
      {openChat && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed z-50"
          style={{ left: position.x, top: position.y }}
        >
          <Draggable
            nodeRef={draggleRef}
            handle=".chat-header"
            defaultPosition={position}
            // position={position}
            onStop={(_, data) =>
              dispatch(setChatPosition({ x: data.x, y: data.y }))
            }
            // bounds="parent"
          >
            <Resizable
              size={size}
              minWidth={300}
              minHeight={300}
              maxWidth={800}
              maxHeight={window.innerHeight - 50}
              enable={{ top: false, right: true, bottom: true, left: true }}
              onResizeStop={(_, __, ref, d) =>
                dispatch(
                  setChatSize({
                    width: size.width + d.width,
                    height: size.height + d.height,
                  })
                )
              }
            >
              <div
                ref={draggleRef}
                className="absolute flex flex-col bg-white shadow-lg rounded-lg overflow-hidden"
                style={{
                  width: size.width,
                  height: size.height,
                  maxHeight: "90vh", // Prevents overflowing beyond viewport
                }}
              >
                {/* Chat Header */}
                <div className="chat-header bg-blue-600 text-white p-3 flex justify-between cursor-move">
                  <span>Chat with Host</span>
                  <button
                    className="text-white text-lg"
                    onClick={() => dispatch(setOpenChat(false))}
                  >
                    ✖
                  </button>
                </div>

                {/* Chat Body - Scrollable when exceeding viewport */}
                {/* Chat Header */}
                <div className="flex items-center px-4 py-2 bg-white shadow">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    shape="circle"
                    onClick={() => navigate(-1)}
                    className="mr-4"
                  />
                  <div className="flex items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Host Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">
                        Room:-{userId + "-" + hostId}
                      </p>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                </div>
                <div className="h-[90%] flex-1 overflow-auto p-3 scrollbar-hide cursor-move">
                  <Chat userId={userId} hostId={hostId} />
                </div>
              </div>
            </Resizable>
          </Draggable>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
