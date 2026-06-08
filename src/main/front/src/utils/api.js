export const RES_SUCCESS = 0;

export const fetchApi = async (url, method = "GET", data = null, customHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const options = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();

  // 커스텀 응답 코드(401)를 확인하여 세션 만료 처리 (로그인 화면 제외)
  if (responseData.code === 401 && !url.includes('/api/admin/login')) {
    alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
    window.location.href = "/admin";
    return responseData;
  }

  if (window.debugOption?.dev?.()) {
    console.log(`[API Response] ${method} ${url} : `, responseData);
  }

  return responseData;
};
