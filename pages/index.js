import { useState } from 'react';
import { Box, Button, Card, CardBody, CardHeader, Container, Flex, Heading, Text, Tooltip } from '@chakra-ui/react';
import { createPost, editPost, getPosts, deletePost } from '@/utils/api';
import { ChevronRightIcon, PlusSquareIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ModalEditCreate from '@/components/ModalEditCreate';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import ModalDelete from '@/components/ModalDelete';
import DrawerDetail from '@/components/DrawerDetail';

export default function Home() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [typeModal, setTypeModal] = useState('');
  const [dataFetch, setdataFetch] = useState([]);
  const [indexDelete, setIndexDelete] = useState(0);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [detailShown, setDetailShown] = useState({
    title: '',
    body: '',
  })
  const [initialInput, setInitialInput] = useState({
    title: '',
    body: '',
    id: '',
  })

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm();

  const {
    status,
    error,
    data: posts,
    isLoading 
  } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
    onSuccess: (a) => {
      setdataFetch(a);
    }
  })

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: newPost => {
      setdataFetch([...dataFetch, newPost]);
      reset();
      handleOpenModal();

      toast('Add post success!', {
          type: toast.TYPE.SUCCESS,
          position: toast.POSITION.TOP_RIGHT,
      })
    },
    onError: (e) => {
      console.log(e);
    }
  })

  const createPutMutation = useMutation({
    mutationFn: editPost,
    onSuccess: newPost => {
      const index = dataFetch.findIndex(x => x.id === newPost.id);
      let changeData = {
        ...dataFetch[index],
        title: newPost.title,
        body: newPost.body,
      }
      dataFetch[index] = changeData;

      reset();
      handleOpenModal();

      toast('Add post success!', {
          type: toast.TYPE.SUCCESS,
          position: toast.POSITION.TOP_RIGHT,
      })
    },
    onError: (e) => {
      console.log(e);
    }
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const cutWord = (word, limit) => {
    let cuttedString;

    if (word.length > limit) {
      cuttedString = word.substring(0, limit) + "..."
    } else {
      cuttedString = word;
    }
    return cuttedString;
  }

  const handleOpenModal = (type, title, body, id) => {
    setIsOpen(!isOpen);
    setTypeModal(type);
    setInitialInput({
      title,
      body,
      id,
    });
    reset();
  }

  const onSubmit = (data) => {
    createPostMutation.mutate({
      title: data.title,
      body: data.body,
      userId: 1,
      id: Date.now(),
    });
  }

  const onEdit = (data) => {
    createPutMutation.mutate({
      title: data.title,
      body: data.body,
      userId: 1,
      id: initialInput.id,
    });
    try {
      const index = dataFetch.findIndex(x => x.id === initialInput.id);
      let changeData = {
        ...dataFetch[index],
        title: data.title,
        body: data.body,
      };
      
      dataFetch[index] = changeData;

      reset();
      handleOpenModal();

      toast('Add post success!', {
          type: toast.TYPE.SUCCESS,
          position: toast.POSITION.TOP_RIGHT,
      })
    } catch (error) {
      console.log(error);
    }
  }

  const openModalDelete = (id) => {
    const indexDelete = dataFetch.findIndex(i => i.id === id);
    setIndexDelete(dataFetch[indexDelete].id);
    setIsDeleteModal(true);
  }

  const handleDelete = () => {
    const result = dataFetch.filter(x => x.id !== indexDelete);

    setdataFetch(result);
    setIsDeleteModal(false);
    toast('Success delete data!', {
      type: toast.TYPE.SUCCESS,
      position: toast.POSITION.TOP_RIGHT,
  })
  }

  const handleOpenDrawer = (post) => {
    setDetailShown({
      title: post ? post.title : '',
      body: post ? post.body : '',
    })
    setIsDrawerOpen(!isDrawerOpen);
  }

  return (
    <>
      {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
      <Container maxW="container.lg" pt={10}>
        <Box>
          <Flex justifyContent='space-between'>
            <Heading as='h4' size='lg' mb={10}>Posts List</Heading>
            <Button onClick={() => handleOpenModal('create')} leftIcon={<PlusSquareIcon />} colorScheme='whatsapp'>Create Post</Button>
          </Flex> 
          <Box>
            { 
              createPostMutation.isLoading ? (
                <p>Loading...</p> 
              ) : (
                dataFetch.map((post, idx) => {
                  return (
                    <>
                      <Card key={`post-${idx}`} mb={6}>
                        <CardHeader>
                          <Flex gap='20px' justifyContent='space-between'>
                            <Tooltip width='100%' label={post.title.length > 45 && post.title}>
                              <Heading maxW='70%' fontSize='2xl' textTransform='uppercase'>{cutWord(post.title, 45)}</Heading>
                            </Tooltip>
                            <Button onClick={() => handleOpenDrawer(post)} rightIcon={<ChevronRightIcon />}>Lihat Detail</Button>
                          </Flex>
                        </CardHeader>
                        <CardBody>
                          <Flex justifyContent='space-between'>
                            <Text maxW='70%' mt={4}>{cutWord(post.body, 150)}</Text>
                            <Flex justifyContent='flex-end' flexDirection='column'>
                              <Button colorScheme='yellow' mb={2} onClick={() => handleOpenModal('edit', post.title, post.body, post.id)}><EditIcon /></Button>
                              <Button colorScheme='red' onClick={() => openModalDelete(post.id)} ><DeleteIcon /></Button>
                            </Flex>
                          </Flex>
                        </CardBody>
                      </Card>
                    </>
                  )
                })
                )
              }
          </Box>
        </Box>
      </Container>
      <ModalEditCreate onEdit={onEdit} initialInput={initialInput} onSubmit={onSubmit} handleOpenModal={handleOpenModal} isOpen={isOpen} type={typeModal} error={errors} register={register} handleSubmit={handleSubmit} reset={reset} setValue={setValue} getValues={getValues} />
      <ModalDelete handleOpenModal={openModalDelete} isOpen={isDeleteModal} onDelete={handleDelete} handleSubmit={handleSubmit} closeModal={setIsDeleteModal} />
      <DrawerDetail isOpen={isDrawerOpen} onClose={handleOpenDrawer} title={detailShown.title} body={detailShown.body} />
    </>
  )
}
