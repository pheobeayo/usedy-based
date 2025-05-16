export const convertProxyToObject = (proxyData) => {
  if (proxyData && typeof proxyData === 'object' && 'length' in proxyData) {
    return Array.from({ length: proxyData.length }).map((_, i) => {
      if (proxyData[i] && typeof proxyData[i] === 'object' && 'length' in proxyData[i]) {
        return convertProxyToObject(proxyData[i]);
      }
      return proxyData[i];
    });
  }
  return proxyData;
};