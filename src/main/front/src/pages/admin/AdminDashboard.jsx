import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdleTimeout } from '../../hooks/useIdleTimeout';
import { fetchApi, RES_SUCCESS } from '../../utils/api';
import CommonSettings from '../../components/admin/CommonSettings';
import StoreManagement from '../../components/admin/StoreManagement';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('common');
  const [storeView, setStoreView] = useState('list'); // 'list' or 'detail'
  const navigate = useNavigate();

  useIdleTimeout(true);

  // 대시보드 진입 시 세션 체크
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetchApi('/api/admin/check');
        if (response.code !== RES_SUCCESS) {
          navigate('/admin');
        }
      } catch (error) {
        console.error(error);
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await fetchApi('/api/admin/logout', 'POST');
        navigate('/admin');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="logo-area">
          </div>
          <h3>패밀리오피스 청담센터</h3>
          <div className="admin-user-info">
            <span className="admin-name">Admin</span> 님 환영합니다 &nbsp;|&nbsp; 
            <span className="admin-logout-link" onClick={handleLogout}> 로그아웃</span>
          </div>
        </div>
        <ul className="admin-sidebar-menu">
          <li 
            className={`admin-sidebar-menu-item ${activeTab === 'common' ? 'active' : ''}`}
            onClick={() => { setActiveTab('common'); setStoreView('list'); }}
          >
            공통정보 관리
          </li>
          <li 
            className={`admin-sidebar-menu-item ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => { setActiveTab('stores'); setStoreView('list'); }}
          >
            입점사 통합 관리
          </li>
        </ul>
      </div>

      <div className="admin-main-content">
        {activeTab === 'common' && <CommonSettings />}
        {activeTab === 'stores' && <StoreManagement storeView={storeView} setStoreView={setStoreView} />}
      </div>
    </div>
  );
}

export default AdminDashboard;
