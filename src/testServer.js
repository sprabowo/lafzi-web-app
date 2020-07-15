import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get(`${process.env.REACT_APP_API_URL}/api`, (req, res, ctx) => {
    const queryString = req.url.searchParams.get('q')
    if (queryString == 'iyyakanabudu') {
      return res(
        ctx.status(200),
        ctx.json({
          "api_code": 200,
          "status": "success",
          "data": [
            {
              "surah": 1,
              "name": "Al-Fatihah",
              "ayat": 5,
              "text": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
              "trans": "Hanya Engkaulah yang kami sembah, dan hanya kepada Engkaulah kami meminta pertolongan.",
              "score": 12.330769230769231,
              "highlightPos": [
                [
                  0,
                  29
                ]
              ],
              "text_hilight": "<span class='hl_block'>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ن</span>َسْتَعِينُ"
            }
          ],
          "info": {
            "limit": "5",
            "current_page": 1,
            "total_page": 1
          }
        })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({ "api_code": 200, "status": "success", "data": [] })
    )
  }),
  rest.get('*', (req, res, ctx) => {
    console.error(`Please add request handler for ${req.url.toString()}`);
    return res(
      ctx.status(500),
      ctx.json({ error: "You must add request handler." })
    );
  })
)

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

export { server, rest };