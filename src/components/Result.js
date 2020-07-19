/** @jsx jsx */
/* @jsxFrag React.Fragment */
import { jsx } from "@emotion/core";
import React, { useState, Suspense, useEffect } from 'react';
import { Box, PseudoBox, Heading, Text, Button, useToast } from '@chakra-ui/core';
const Footer = React.lazy(() => import('./Footer'));

export default function Result({ ayats, status, info, onLoadMore }) {
  const [buttonloading, setButtonloading] = useState(false);
  useEffect(() => {
    setButtonloading(false);
  }, [info]);
  const toast = useToast();
  if (ayats && ayats.length === 0 && status === 'loading') return null
  if (ayats && ayats.length === 0 && status === 'failed') {
    return (
      <>
        <Box mt="24px">
          <Heading as="h2" fontSize="md"><span role="img" aria-label="warning while fetching data">⚠️</span> an error occured</Heading>
        </Box>
      </>
    )
  }
  if (ayats && ayats.length === 0 && status === 'success') {
    return (
      <>
        <Box mt="24px">
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
      <Box mt="24px">
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
            }} variant="outline" variantColor="green" rounded="full">load more</Button>
          </Box>
        }
        <Suspense fallback={<></>}>
          <Footer />
        </Suspense>
      </Box>
    </>
  );
}