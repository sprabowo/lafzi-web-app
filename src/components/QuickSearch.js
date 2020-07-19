import React from 'react';
import { Box, Button, Text } from '@chakra-ui/core';

export default function QuickSearch({ onQuickSearch }) {
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
};