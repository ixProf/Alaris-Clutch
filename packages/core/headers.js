'use strict';

/**
 * Returns modern realistic browser stealth headers consistent with Chromium on Windows.
 * 
 * @param {Object} options
 * @param {string} [options.userAgent] - Browser User-Agent string
 * @param {boolean} [options.isDetail] - Whether this is a detail/subsequent page request
 * @param {string} [options.referer] - Referer header URL
 * @param {string} [options.accept] - 'text/html' (default) or 'application/json'
 * @returns {Record<string, string>}
 */
function getStealthHeaders({ userAgent, isDetail = false, referer, accept = 'text/html' } = {}) {
  const ua = userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

  const isJson = accept === 'application/json';

  const headers = {
    'User-Agent': ua,
    'Accept': isJson
      ? 'application/json, text/plain, */*'
      : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': isJson ? 'empty' : 'document',
    'Sec-Fetch-Mode': isJson ? 'cors' : 'navigate',
    'Sec-Fetch-Site': isDetail ? 'same-origin' : 'none',
  };

  if (!isJson) {
    headers['Sec-Fetch-User'] = '?1';
    headers['Upgrade-Insecure-Requests'] = '1';
  }

  if (isDetail && referer) {
    headers['Referer'] = referer;
  }

  return headers;
}

module.exports = { getStealthHeaders };
