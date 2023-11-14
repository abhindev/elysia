export function checkUrlAndHost(host:String) {
    const origin = '127.0.0.1:3001'
    if (host === origin) {
      return true;
    } else {
      return false;
    }
  }