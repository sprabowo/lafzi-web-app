import { search } from './lafzi';
import { server, rest } from '../testServer';

it('search correctly', async () => {
  const lafzi = await search("iyyakanabudu")
  expect(lafzi.api_code).toEqual(200)
  expect(lafzi.status).toEqual("success")
  expect(lafzi.data).toHaveLength(1)
});

it('search no result', async () => {
  const lafzi = await search("never find here if you just type")
  expect(lafzi.api_code).toEqual(200)
  expect(lafzi.status).toEqual("success")
  expect(lafzi.data).toHaveLength(0)
});

it("handles failure", async () => {
  server.use(
    rest.get(`${process.env.REACT_APP_API_URL}/api`, (_req, res, ctx) => {
      return res(ctx.status(502));
    })
  );
  await expect(search(12311223)).rejects.toThrow("502");
});
