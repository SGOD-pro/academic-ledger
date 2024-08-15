
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '@/toolkit/slices/Toast';
import { AppDispatch } from '@/toolkit'; 
import { ToastInterface } from '@/interfaces';

const useToast = () => {
  const dispatch:AppDispatch = useDispatch();

  const show = useCallback(({ summary, detail, type }: ToastInterface) => {
    dispatch(
      showToast({
        severity: type,
        summary,
        detail,
        visible: true,
      })
    );
  }, [dispatch]);

  return { show };
};

export default useToast;
