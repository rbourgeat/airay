import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, message, Alert, Progress, Tag, Segmented, Input } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import Marquee from 'react-fast-marquee';
import axios from 'axios';
import UploadImages from './components/UploadImage';
import CustomHeader from './Header';

const { Text } = Typography;
const { TextArea } = Input;

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState('Loading models...');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [detectionMode, setDetectionMode] = useState('Image Detection');

  const handleImageUpload = (file) => {
    setImage(file);
  };

  const handleSubmitImage = async () => {
    if (!image) {
      messageApi.open({
        type: 'error',
        content: 'Please select an image to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5042/detect-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      messageApi.open({
        type: 'success',
        content: 'Image scan done!',
      });
    } catch (error) {
      console.error("Error details: ", error.response ? error.response.data : error.message);
      messageApi.open({
        type: 'error',
        content: error.response ? error.response.data.error : 'Failed to process image. Please try again.',
      });
    }
  };

  const handleSubmitText = async () => {
    if (!text.trim()) {
      messageApi.open({
        type: 'error',
        content: 'Please enter some text for analysis.',
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5042/detect-text', { text });
      setResult(response.data);
      messageApi.open({
        type: 'success',
        content: 'Text analysis done!',
      });
    } catch (error) {
      console.error("Error details: ", error.response ? error.response.data : error.message);
      messageApi.open({
        type: 'error',
        content: error.response ? error.response.data.error : 'Failed to analyze text. Please try again.',
      });
    }
  };

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5042/health');
        if (response.data.clip_model_loading === 'loading' || response.data.text_model_status === 'loading') {
          setModelLoading(true);
          setBackendStatus('Model is loading... Please wait...');
        } else {
          setModelLoading(false);
          setBackendStatus('Backend is running.');
        }
      } catch (error) {
        setBackendStatus('Backend is not running. Please start the server...');
      } finally {
        setLoading(false);
      }
    };

    checkBackendStatus();

    const interval = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {contextHolder}
      <div className="borderMenu" />
      <div 
        style={{
          margin: 0,
          padding: 0,
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to bottom right, #C8736E, #601418)',
        }}
      >
        <CustomHeader />
        <Card
          title={
            <Segmented
              options={['Image Detection', 'Text Detection']}
              value={detectionMode}
              onChange={(value) => {
                setDetectionMode(value);
                setResult(null);
              }}
            />
          }
          bordered={false}
          style={{
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          { modelLoading ? (
            <Alert
              message={backendStatus}
              style={{ marginBottom: '20px' }}
              type={backendStatus.includes('not running') || backendStatus.includes('down') ? 'error' : 'warning'}
              showIcon
            />
          ) : null}
          {detectionMode === 'Image Detection' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
              <UploadImages onImageUpload={handleImageUpload} />
              <Button
                variant="outlined"
                color="danger"
                icon={<ScanOutlined />}
                onClick={handleSubmitImage}
                style={{ marginTop: '10px' }}
                disabled={modelLoading}
              >
                Analyze Image
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
              <TextArea
                placeholder="Enter text to analyze..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ marginBottom: '10px', width: '250px' }}
                className="red"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
              <Button
                variant="outlined"
                color="danger"
                icon={<ScanOutlined />}
                onClick={handleSubmitText}
                disabled={modelLoading}
              >
                Analyze Text
              </Button>
            </div>
          )}
          { result && result.result && (
            <Text
              type={result.result.includes('AI-generated') ? 'danger' : 'success'}
              style={{ marginTop: '10px' }}
            >
              <Tag 
                color={result.result.includes('AI-generated') ? 'red' : 'green'}
                style={{
                  marginTop: '10px',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                {result.result}
              </Tag>
              <Progress
                strokeColor={result.result.includes('AI-generated') ? 'red' : 'green'}
                percent={(result.confidence * 100).toFixed(2)}
                size="small"
              />
            </Text>
          )}
        </Card>
      </div>
    </>
  );
}