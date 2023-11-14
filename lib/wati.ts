export const Wati = async (row: any, phoneNumber: string) => {
  try {
    const response = await fetch(
      `https://app-server.wati.io/api/v1/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYzVlOWE3YS0zMTA0LTQ3OWItYTUxNS1kNzlhYjAxMmVhOTIiLCJ1bmlxdWVfbmFtZSI6InZpaGFyYWxpZmVjYXJlQGdtYWlsLmNvbSIsIm5hbWVpZCI6InZpaGFyYWxpZmVjYXJlQGdtYWlsLmNvbSIsImVtYWlsIjoidmloYXJhbGlmZWNhcmVAZ21haWwuY29tIiwiYXV0aF90aW1lIjoiMDgvMTIvMjAyMyAwNDozODoxNCIsImRiX25hbWUiOiJ3YXRpX2FwcF90cmlhbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJUUklBTCIsIlRSSUFMUEFJRCJdLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.sul1-9raAz9zvBwvpL70kMvrSPYzImrfztkYKN0c4YE`,
        },
        body: row,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response;
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};
