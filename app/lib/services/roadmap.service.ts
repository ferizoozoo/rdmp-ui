export async function addRoadmap(splitLinks: string[]) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/ai/roadmap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ links: splitLinks }),
    });
    const data = await res.json();
    return data;
}