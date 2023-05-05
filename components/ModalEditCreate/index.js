import React, { useEffect } from 'react';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea } from '@chakra-ui/react'

function ModalEditCreate({ initialInput, handleOpenModal, isOpen, type, error, register, handleSubmit, reset, setValue, onSubmit, onEdit }) {

    useEffect(() => {
      if (type === 'edit') {
        setValue('title', initialInput.title);
        setValue('body', initialInput.body);
      }
    }, [initialInput, type, setValue])
    
    

    return (
        <Modal onClose={handleOpenModal} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize='24px'>{type === 'edit' ? 'Edit' : 'Create'} Post</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(type === 'edit' ? onEdit : onSubmit)}>
                    <ModalBody>
                        <FormControl mb={5} isInvalid={error.title}>
                            <FormLabel>Title</FormLabel>
                            <Input type='text' placeholder='Input your title' {...register('title', { required: "Title is required!" })} />
                            <FormErrorMessage>
                                {error.title && error.title.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={error.body}>
                            <FormLabel>Body</FormLabel>
                            <Textarea height='300px' placeholder='Input your story here...' resize='none' {...register('body', { required: "Body is required!" })} />
                            <FormErrorMessage>
                                {error.body && error.body.message}
                            </FormErrorMessage>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={2} onClick={handleOpenModal}>Close</Button>
                        <Button colorScheme={type === 'edit' ? 'yellow' : 'whatsapp'} type='submit'>{type === 'edit' ? 'Edit' : 'Create'}</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

export default ModalEditCreate