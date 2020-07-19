import React from 'react';
import { Flex, Link } from '@chakra-ui/core';

export default function Footer() {
  return (
    <Flex mt="24px" flex="0 0 100%" flexWrap="wrap" justifyContent="center" maxWidth="100%">
      <Link color="gray.300" textShadow="0px 2px 2px rgba(0,0,0,.1)" href="https://github.com/sprabowo/lafzi-web-app">{`< source code />`}</Link>
    </Flex>
  )
};