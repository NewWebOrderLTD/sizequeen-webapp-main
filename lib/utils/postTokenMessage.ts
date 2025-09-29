export function postTokenMessage(webAuthToken: string, webAuthRefreshToken: string) {
  console.log('🔗 postTokenMessage called with tokens:', {
    webAuthToken: webAuthToken ? 'present' : 'empty',
    webAuthRefreshToken: webAuthRefreshToken ? 'present' : 'empty',
    origin: window.location.origin
  });

  window.postMessage(
    {
      type: 'sizequeen-token',
      webAuthToken: webAuthToken,
      webAuthRefreshToken: webAuthRefreshToken
    },
    window.location.origin
  );
  
  console.log('✅ postTokenMessage: sizequeen-token message sent');
} 