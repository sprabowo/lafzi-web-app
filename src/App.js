/** @jsx jsx */
/* @jsxFrag React.Fragment */
import React, { useState } from 'react';
import { jsx } from "@emotion/core";
import { Flex, Box, PseudoBox, Text, Image, Input, InputRightElement, InputGroup, Button, useToast, Icon, Heading, Link } from '@chakra-ui/core';
import { search } from './utils/lafzi';
import {Helmet} from 'react-helmet';

function App() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState([]);
  const [pageinfo, setPageinfo] = useState(null);
  const [status, setStatus] = useState('loading'); // ['loading', 'success', 'failed']
  const [buttonloading, setButtonloading] = useState(false);

  const handleSearch = async (query, page = 1) => {
    setResult([])
    setButtonloading(true)
    setStatus('loading');
    try {
      const data = await search(query, page);
      if (data.data && data.data.length) {
        setResult(data.data);
        setPageinfo(data.info);
      }
      setStatus('success');
    } catch (error) {
      setStatus('failed');
    }
    setButtonloading(false);
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
    <Box maxWidth="36rem" pb="16px" minH="100vh" width="full" mx="auto" backgroundColor="white"
      boxShadow="0 6px 18px 0 rgba(0,0,0,.2)">
      <Helmet>
        <meta charset="utf-8" />
        <title>Lafzi App</title>
        <meta name="description" content="search ayat in AlQuran" />
        <meta itemprop="name" content="Lafzi App" />
        <meta itemprop="description" content="search ayat in AlQuran" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Lafzi App" />
        <meta name="twitter:description" content="search ayat in AlQuran" />
        <meta name="twitter:image:src" content="https://lafzi-web.vercel.app/twitter.jpg" />
        <meta name="og:title" content="Lafzi App" />
        <meta name="og:description" content="search ayat in AlQuran" />
        <meta name="og:image" content="https://lafzi-web.vercel.app/fb.jpg" />
        <meta name="og:type" content="website" />
      </Helmet>
      <Flex flex="0 0 100%" maxW="100%" flexWrap="wrap" justifyContent="center">
        <Image
          draggable="false"
          maxW={{ base: "150px", lg: "200px" }}
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
      <QuickSearch onQuickSearch={(query) => handleQuickSearch(query)} />
      <Fetcher info={pageinfo} onLoadMore={(page) => handleLoadMore(page)} keyword={keyword} ayats={result} status={status} />
    </Box>
  );
}

export const QuickSearch = React.memo(({ onQuickSearch }) => {
  return (
    <>
      <Box mt="16px" textAlign="center">
        <Text color="gray.500" fontSize="xs">try quick search:</Text>
      </Box>
      <Box mt="4px" w={{ base: "calc(100% - 48px)", lg: "30rem" }} textAlign="center" mx={{ base: "24px", lg: "auto" }}>
        <Button variantColor="green" variant="outline" onClick={() => onQuickSearch('fabiayyialairobbikuma')} size="xs" my="4px" mr="8px" rounded="full">fabiayyialairobbikuma</Button>
        <Button variantColor="green" variant="outline" onClick={() => onQuickSearch('alhamdulillah')} size="xs" my="4px" mr="8px" rounded="full">alhamdulillah</Button>
        <Button variantColor="green" variant="outline" onClick={() => onQuickSearch('kun fayaakun')} size="xs" my="4px" mr="8px" rounded="full">kun fayaakun</Button>
      </Box>
    </>
  );
});

export const Fetcher = React.memo(({ ayats, status, info, onLoadMore }) => {
  const [buttonloading, setButtonloading] = useState(false);
  const toast = useToast();
  if (ayats && ayats.length === 0 && status === 'loading') return null
  if (ayats && ayats.length === 0 && status === 'failed') {
    return (
      <>
        <Box mt="24px" w={{ base: "calc(100% - 48px)", lg: "30rem" }} textAlign="center" mx={{ base: "24px", lg: "auto" }}>
          <Heading as="h2" fontSize="md"><span role="img" aria-label="warning while fetching data">⚠️</span> an error occured</Heading>
        </Box>
      </>
    )
  }
  if (ayats && ayats.length === 0 && status === 'success') {
    return (
      <>
        <Box mt="24px" w={{ base: "calc(100% - 48px)", lg: "30rem" }} textAlign="center" mx={{ base: "24px", lg: "auto" }}>
          <Heading as="h2" fontSize="md">no result found</Heading>
        </Box>
      </>
    )
  }

  const handleClipboard = (text, copyright = ' \n\n (src: lafzi-web.vercel.app)') => {
    const el = document.createElement('textarea');
    el.value = text + copyright;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast({
      title: "Text copied!",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  };

  return (
    <>
      <Box mt="24px" w={{ base: "calc(100% - 48px)", lg: "30rem" }} mx={{ base: "24px", lg: "auto" }}>
        {ayats.map((ayat) => (
          <PseudoBox
            css={{
              ".hl_block": { 
                padding: "4px",
                fontWeight: "bold" 
              },
              "&:hover .hl_block": { 
                backgroundColor: "#c6f6d5" 
              }
            }}
            key={ayat.ayat + ayat.name}
            role="group" p="24px" _hover={{ borderColor: "green.600", cursor: "pointer", boxShadow: "0 6px 18px 0 rgba(0,0,0,.2)" }} border="2px solid transparent" borderRadius="8px" mb={{ base: "16px", lg: "24px" }} boxShadow="0 2px 6px 0 rgba(0,0,0,.2)"
          >
            <Box lang="ar" css={{ textAlign: "right", fontFamily: "Utsmani" }} dir="rtl" dangerouslySetInnerHTML={{ __html: ayat.text_hilight }}></Box>
            <Box w="100%" mt="16px">
              <Text fontSize="sm">{ayat.trans}&nbsp;
                <Text as="cite">Q.S. {ayat.name} ({ayat.surah}:{ayat.ayat})</Text>
              </Text>
            </Box>
            <Box w="100%" mt="8px">
              <Button onClick={() => handleClipboard(`${ayat.text} \n\n\n ${ayat.trans} Q.S. ${ayat.name} (${ayat.surah}:${ayat.ayat})`)} size="xs" my="4px" rounded="8px" mr="8px">copy ayat + trans</Button>
              <Button onClick={() => handleClipboard(`${ayat.text} \n\n Q.S. ${ayat.name} (${ayat.surah}:${ayat.ayat})`)} size="xs" my="4px" rounded="8px" mr="8px">copy ayat</Button>
              <Button onClick={() => handleClipboard(`Q.S. ${ayat.name} (${ayat.surah}:${ayat.ayat})`)} size="xs" my="4px" rounded="8px">copy position</Button>
            </Box>
          </PseudoBox>
        ))}
        {
          info && info.current_page < info.total_page &&
          <Box w="100%" mt="16px" textAlign="center">
            <Button isLoading={buttonloading} size="sm" w={{base: "50%", lg: "30%"}} onClick={() => {
              setButtonloading(true);
              onLoadMore(parseInt(info.current_page) + 1);
              setButtonloading(false);
            }} variant="outline" variantColor="green" rounded="full">load more</Button>
          </Box>
        }
        <Footer/>
      </Box>
    </>
  );
});


const Footer = () => {
  return (
    <Flex mt="24px" flex="0 0 100%" flexWrap="wrap" justifyContent="center" maxWidth="100%">
      <Link color="gray.300" textShadow="0px 2px 2px rgba(0,0,0,.1)" href="https://github.com/sprabowo/lafzi-web-app">{`< source code />`}</Link>
    </Flex>
  )
};

export default App;

