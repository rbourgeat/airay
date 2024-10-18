import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UploadImages = ({ onImageUpload }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {

    if (newFileList.length > 0) {
      setFileList(newFileList);
      onImageUpload(newFileList[0].originFileObj); 
    } else {
      setFileList([]);
      onImageUpload(null);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ margin: '10px' }}>Add</div>
    </div>
  );

  return (
    <>
      <Upload
        className="red"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={() => false}
        onPreview={handlePreview}
      >
        {fileList.length < 1 ? uploadButton : null}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}

    </>
  )
};

export default UploadImages;