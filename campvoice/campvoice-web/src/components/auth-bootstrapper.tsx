'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthBootstrapper() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const validateSession = useAuthStore((s) => s.validateSession);

  useEffect(() => {
    if (token && !user) validateSession();
  }, [token, user, validateSession]);

  return null;
}

