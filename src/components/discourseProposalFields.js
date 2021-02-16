import React, { useEffect } from 'react';
import {
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';

import TextBox from './TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { eu } from 'date-fns/locale';

const forumTopics = [
  {
    id: 261,
    title: 'About the cheese dao category',
  },
  {
    id: 262,
    title: 'wtf',
  },
];

const DiscourseProposalFields = ({ register, watch, setValue }) => {
  const { daoMetaData } = useMetaData();
  const { theme } = useCustomTheme();
  const watchCreateForum = watch('createForum', false);

  useEffect(() => {
    if (watchCreateForum) {
      console.log('watchCreateForum', watchCreateForum);
      setValue('forumId', null);
    }
  }, [watchCreateForum]);

  return (
    <>
      {daoMetaData?.boosts.discourse?.active ? (
        <>
          <TextBox as={FormLabel} size='sm' htmlFor='discourse' mb={2} mt={7}>
            Add a Discourse Forum Topic?
          </TextBox>
          <FormControl mb={5}>
            <Checkbox
              ref={register}
              name='createForum'
              defaultIsChecked={false}
            >
              <TextBox as={FormLabel} size='xs' htmlFor='createForum' mt={1}>
                Create a New Topic
              </TextBox>
            </Checkbox>
          </FormControl>
          {!watchCreateForum ? (
            <FormControl mb={5}>
              <TextBox as={FormLabel} size='xs' htmlFor='forumId'>
                OR Select existing forum topic
              </TextBox>
              <Select
                placeholder='Select forum topic'
                icon={<AiOutlineCaretDown />}
                name='forumId'
                color='whiteAlpha.900'
                ref={register}
              >
                {forumTopics?.map((topic) => {
                  return (
                    <option
                      key={topic.id}
                      value={topic.id}
                      color={theme.colors.whiteAlpha[900]}
                      background={theme.colors.blackAlpha[900]}
                    >
                      {topic.title}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
          ) : null}
        </>
      ) : null}
    </>
  );
};

export default DiscourseProposalFields;
