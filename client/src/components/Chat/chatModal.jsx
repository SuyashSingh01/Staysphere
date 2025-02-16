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

const ChatModal = () => {
  const dispatch = useDispatch();
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
                <div className="h-[90%] flex-1 overflow-auto p-3 scrollbar-hide cursor-move">
                  <Chat userId={1} hostId={2} />
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
