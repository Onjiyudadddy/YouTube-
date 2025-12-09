import { useState, useEffect } from 'react';
import youtubeApi from '../services/youtubeApi';

const ApiKeyInput = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSet, setIsSet] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const savedKey = youtubeApi.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsSet(true);
      onApiKeySet(true);
    } else {
      setShowInput(true);
    }
  }, [onApiKeySet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      youtubeApi.setApiKey(apiKey.trim());
      setIsSet(true);
      setShowInput(false);
      onApiKeySet(true);
    }
  };

  const handleChange = () => {
    setShowInput(true);
    setIsSet(false);
  };

  const handleRemove = () => {
    setApiKey('');
    setIsSet(false);
    setShowInput(true);
    localStorage.removeItem('youtube_api_key');
    onApiKeySet(false);
  };

  if (isSet && !showInput) {
    return (
      <div className="api-key-status">
        <div className="api-key-indicator">
          <span className="status-icon">✓</span>
          <span>API 키 설정됨</span>
        </div>
        <div className="api-key-actions">
          <button onClick={handleChange} className="btn-secondary">변경</button>
          <button onClick={handleRemove} className="btn-danger">제거</button>
        </div>
      </div>
    );
  }

  return (
    <div className="api-key-input">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="YouTube Data API v3 키를 입력하세요"
            className="api-input"
          />
          <button type="submit" className="btn-primary">
            설정
          </button>
        </div>
        <p className="api-help-text">
          API 키가 필요합니다.
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cloud Console
          </a>에서 발급받으세요.
        </p>
      </form>
    </div>
  );
};

export default ApiKeyInput;
