import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi, RES_SUCCESS } from '../../utils/api';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchApi('/api/admin/login', 'POST', { id: username, password });

      if (response.code === RES_SUCCESS) {
        navigate('/admin/dashboard');
      } else {
        alert(response.message || '아이디 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="logo-shinhan"></span>
          <span className="center-name">패밀리오피스 청담센터</span>
        </div>
        <h2>통합 관리자 로그인</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input 
            type="text" 
            placeholder="아이디" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="admin-login-input"
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login-input"
          />
          <button type="submit" className="admin-login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
