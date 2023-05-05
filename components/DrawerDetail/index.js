import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Text } from '@chakra-ui/react'
import React from 'react'

function DrawerDetail({ onClose, isOpen, title, body }) {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size='md'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{title}</DrawerHeader>
          <DrawerBody>
            <Text>{body}</Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  )
}

export default DrawerDetail