import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../utils/api';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const useIdleTimeout = (isAdminRoute) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAdminRoute) return;

    const handleTimeout = async () => {
      try {
        await fetchApi('/api/admin/logout', 'POST');
      } catch (error) {
        console.error(error);
      }
      
      alert('세션이 만료되어 로그인 페이지로 이동합니다.');
      navigate('/admin');
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleTimeout, TIMEOUT_MS);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => document.addEventListener(event, resetTimer));
    resetTimer(); // Initialize on mount

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [isAdminRoute, navigate]);
};
