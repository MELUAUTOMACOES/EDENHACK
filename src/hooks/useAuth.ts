import { useState, useEffect } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { apiFetch } from '@/lib/api';
import { authenticatedRequest } from '@/lib/http';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // If user is created and name is provided, update profile
      if (data.user && name) {
        try {
          await authenticatedRequest('/api/profiles/me', {
            method: 'PATCH',
            body: JSON.stringify({ name }),
          });
        } catch (profileError) {
          console.warn('Failed to update profile after signup:', profileError);
        }
      }

      return { data, error: null };
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Signup failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { data: null, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { data: null, error: errorMessage };
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      const errorMessage = (error as AuthError).message || 'Logout failed';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return { error: errorMessage };
    }
  };

  const getUser = () => state.user;

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    getUser,
  };
};
