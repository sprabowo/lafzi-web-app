import React, { useState, Suspense } from 'react';
import { Global, css } from '@emotion/core';
import { Flex, Box, Image, Input, InputRightElement, InputGroup, Button, Icon, Skeleton } from '@chakra-ui/core';
import { Helmet } from 'react-helmet';
import { search } from './utils/lafzi';
const QuickSearch = React.lazy(() => import('./components/QuickSearch'));
const Result = React.lazy(() => import('./components/Result'));

function App() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState([]);
  const [pageinfo, setPageinfo] = useState(null);
  const [status, setStatus] = useState('loading'); // ['loading', 'success', 'failed']
  const [showresult, setShowresult] = useState(false);
  const [resultloading, setResultloading] = useState(false);
  const [buttonloading, setButtonloading] = useState(false);

  const handleSearch = async (query, page = 1) => {
    setResult([]);
    setButtonloading(true);
    setResultloading(true);
    setStatus('loading');
    try {
      const data = await search(query, page);
      if (data.data && data.data.length) {
        setResult(data.data);
        setPageinfo(data.info);
        setShowresult(true);
      }
      setStatus('success');
    } catch (error) {
      setStatus('failed');
    }
    setButtonloading(false);
    setResultloading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setResult([])
      handleSearch(keyword)
    }
  };

  const handleQuickSearch = (args) => {
    setKeyword(args)
    setResult([])
    handleSearch(args)
  };

  const handleLoadMore = async (args) => {
    let nextData = await search(keyword, args);
    let tmpData = []
    tmpData = result.concat(nextData.data)
    setResult(tmpData)
    setPageinfo(nextData.info)
  };

  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          img:not([src]):not([srcset]), img[src=""] {
            visibility: hidden;
          }
          @-moz-document url-prefix() {img:-moz-loading{visibility:hidden}}
          @font-face {
            font-family: 'Utsmani';
            src: url('/fonts/UthmanicHafs1 Ver13.woff2') format('woff2');
            src: url('/fonts/UthmanicHafs1 Ver13.woff2') format('woff2'),
                url('/fonts/UthmanicHafs1 Ver13.woff') format('woff'),
                url('/fonts/UthmanicHafs1 Ver13.eot'),
                url('/fonts/UthmanicHafs1 Ver13.eot?#iefix') format('embedded-opentype'),
                url('/fonts/UthmanicHafs1 Ver13.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}
      />
      <Helmet>
        <meta charset="utf-8" />
        <title>Lafzi App</title>
        <meta name="description" content="search ayat in AlQuran" />
        <meta itemprop="name" content="Lafzi App" />
        <meta itemprop="description" content="search ayat in AlQuran" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lafzi App" />
        <meta name="twitter:description" content="search ayat in AlQuran" />
        <meta name="twitter:image" content="https://lafzi-web.vercel.app/twitter.jpg" />
        <meta name="og:title" content="Lafzi App" />
        <meta name="og:description" content="search ayat in AlQuran" />
        <meta name="og:image" content="https://lafzi-web.vercel.app/fb.jpg" />
        <meta name="og:type" content="website" />
      </Helmet>
      <Box maxWidth="36rem" pb="16px" minH="100vh" width="full" mx="auto" backgroundColor="white"
      boxShadow="0 6px 18px 0 rgba(0,0,0,.2)">
      <Flex flex="0 0 100%" maxW="100%" flexWrap="wrap" justifyContent="center">
        <Image
          draggable="false"
          maxH={{ base: "60px", lg: "85px" }}
          mt="16px"
          src="/logo.png"
          alt="Lafzi Logo"
        />
      </Flex>
      <Flex flex="0 0 100%" maxW="100%" mt="16px" flexWrap="wrap">
        <InputGroup size="md" w={{ base: "full", lg: "20rem" }} mx={{ base: "24px", lg: "auto" }}>
          <Input
            onKeyDown={handleKeyDown}
            borderRadius="8px"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            data-testid="search"
            pr="3rem"
            type="text"
            placeholder="enter latin pronunciation"
          />
          <InputRightElement width="3rem">
            <Button isLoading={buttonloading} aria-label="Search latin in Lafzi" borderRadius="8px" data-testid="button-search" onClick={() => handleSearch(keyword)} size="sm">
              <Icon name="search" />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Suspense fallback={<></>}>
        <QuickSearch onQuickSearch={(query) => handleQuickSearch(query)} />
        <Skeleton
          w={{ base: "calc(100% - 48px)", lg: "30rem" }}
          mx={{ base: "24px", lg: "auto" }}
          my="24px"
          minHeight="200px" borderRadius="8px"
          isLoaded={!resultloading}>
          {showresult && <Result info={pageinfo} onLoadMore={(page) => handleLoadMore(page)} keyword={keyword} ayats={result} status={status} />}
        </Skeleton>
        <Skeleton
          d={ !resultloading? 'none' : 'block' }
          w={{ base: "calc(100% - 48px)", lg: "30rem" }}
          mx={{ base: "24px", lg: "auto" }}
          my="24px"
          minHeight="200px" borderRadius="8px"
          isLoaded={!resultloading}>
        </Skeleton>
        <Skeleton
          d={ !resultloading? 'none' : 'block' }
          w={{ base: "calc(100% - 48px)", lg: "30rem" }}
          mx={{ base: "24px", lg: "auto" }}
          my="24px"
          minHeight="200px" borderRadius="8px"
          isLoaded={!resultloading}>
        </Skeleton>
      </Suspense>
    </Box>
    </>
  );
}

export default App;

