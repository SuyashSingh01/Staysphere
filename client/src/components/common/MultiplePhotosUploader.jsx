import PropTypes from "prop-types";
import { Upload, Modal } from "antd";
import React, { useState, memo } from "react";
import { PlusOutlined } from "@ant-design/icons";

const MultiplePhotoUploader = ({ fileList, setFileList }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.map((file, index) => ({
      ...file,
      uid: file.uid || `${file.name}-${index}`, // Ensure unique uid
    }));
    setFileList(updatedFileList);
  };

  const handleRemove = (file) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
  };

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={() => false} // Prevent auto-upload
      >
        {fileList.length >= 5 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};
MultiplePhotoUploader.propTypes = {
  fileList: PropTypes.array.isRequired,
  setFileList: PropTypes.func.isRequired,
};

export default memo(MultiplePhotoUploader);
