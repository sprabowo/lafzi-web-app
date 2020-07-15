async function searchLafzi(keyword, page = 1, limit = 10) {
  const result = await fetch(`${process.env.REACT_APP_API_URL}/api?q=${keyword}&page=${page}&limit=${limit}`);
  if (!result.ok) {
    throw new Error(`An error occured with status code ${ result.status }`);
  }
  const data = await result.json();
  return data;
}

export { searchLafzi as search };