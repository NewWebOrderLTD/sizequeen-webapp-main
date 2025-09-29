'use client';

import { Session } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { postTokenMessage } from '@/lib/utils/postTokenMessage';

function PostMessageToPlugin({
  session
}: {
  session: Session | null;
}) {
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  
  useEffect(() => {
    console.log('🔌 PostMessageToPlugin: Component mounted');
    console.log('📊 Session status:', session ? 'authenticated' : 'not authenticated');
    
    const sendTokenToPlugin = () => {
      if (session) {
        console.log('📤 Sending tokens to plugin');
        console.log('🔑 Token preview:', {
          accessToken: session.access_token ? `${session.access_token.substring(0, 10)}...` : 'none',
          refreshToken: session.refresh_token ? `${session.refresh_token.substring(0, 10)}...` : 'none'
        });
        
        // Send sizequeen-token message
        window.postMessage({
          type: 'sizequeen-token',
          webAuthToken: session.access_token,
          webAuthRefreshToken: session.refresh_token,
          user: session.user
        }, window.location.origin);
        
        // Send mimicked-token message (for compatibility)
        postTokenMessage(session.access_token || '', session.refresh_token || '');
        
        console.log('✅ Tokens sent to plugin');
      } else {
        console.log('📤 Sending empty tokens (not authenticated)');
        
        // Send empty tokens
        window.postMessage({
          type: 'sizequeen-token',
          webAuthToken: '',
          webAuthRefreshToken: '',
          user: null
        }, window.location.origin);
        
        postTokenMessage('', '');
        console.log('✅ Empty tokens sent to plugin');
      }
    };

    // Send tokens when component mounts
    sendTokenToPlugin();

    // Listen for plugin-ready messages to resend tokens
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || !event.data?.type) {
        return;
      }
      
      if (event.data.type === 'plugin-ready') {
        console.log('✅ Plugin ready, resending tokens');
        sendTokenToPlugin();
      }
    };
    
    window.addEventListener('message', handleMessage);
    console.log('👂 Listening for plugin messages');
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
    
  }, [session?.access_token, session?.refresh_token]); // Only depend on actual token values

  return null;
}

export default PostMessageToPlugin;