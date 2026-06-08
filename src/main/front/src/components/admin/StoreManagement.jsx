import React, { useState, useEffect } from 'react';
import StoreDetailForm from './StoreDetailForm';
import { fetchApi } from '../../utils/api';
import dayjs from 'dayjs';

function StoreManagement({ storeView, setStoreView }) {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchStores = async () => {
    try {
      const response = await fetchApi('/api/stores');
      if (response && response.response) {
        setStores(response.response);
      }
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  useEffect(() => {
    if (storeView === 'list') {
      fetchStores();
      setSelectedIds([]); // 목록으로 돌아올 때 선택 초기화
    }
  }, [storeView]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(stores.map(store => store.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectStore = (e, id) => {
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(storeId => storeId !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 입점사를 선택해주세요.");
      return;
    }
    
    if (window.confirm(`선택한 ${selectedIds.length}개의 입점사를 정말 삭제하시겠습니까?`)) {
      try {
        for (const id of selectedIds) {
          await fetchApi(`/api/stores/${id}`, 'DELETE');
        }
        alert("선택한 입점사가 삭제되었습니다.");
        setSelectedIds([]);
        fetchStores();
      } catch (error) {
        console.error("Failed to delete stores:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleRegister = () => {
    setSelectedStoreId(null);
    setStoreView('detail');
  };

  const handleDetail = (id) => {
    setSelectedStoreId(id);
    setStoreView('detail');
  };

  if (storeView === 'list') {
    return (
      <div className="admin-content-inner">
        <div className="admin-content-header">
          <h2>입점사 리스트</h2>
          <button className="btn-register" onClick={handleRegister}>+ 신규 등록하기</button>
        </div>
        
        <div className="store-list-container">
          <table className="store-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={stores.length > 0 && selectedIds.length === stores.length} 
                  />
                </th>
                <th>층수</th>
                <th>입점사 정보</th>
                <th>업종</th>
                <th>수정일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    등록된 입점사가 없습니다.
                  </td>
                </tr>
              ) : (
                stores.map((store, index) => (
                  <tr key={store.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        onChange={(e) => handleSelectStore(e, store.id)}
                        checked={selectedIds.includes(store.id)}
                      />
                    </td>
                    <td>{store.floor}</td>
                    <td>{store.name}</td>
                    <td>{store.category}</td>
                    <td>{dayjs(store.updatedDate || store.registeredDate).format('YYYY.MM.DD')}</td>
                    <td><button className="btn-detail" onClick={() => handleDetail(store.id)}>상세보기</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="store-list-actions">
            <button className="btn-delete" onClick={handleDeleteSelected}>선택 삭제하기</button>
          </div>
        </div>
      </div>
    );
  }

  if (storeView === 'detail') {
    return <StoreDetailForm storeId={selectedStoreId} onBack={() => setStoreView('list')} />;
  }

  return null;
}

export default StoreManagement;
