import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  Box,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';

import TextBox from './TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { getForumTopics } from '../utils/metadata';

const DiscourseProposalFields = ({ register, watch, setValue }) => {
  const { daoMetaData } = useMetaData();
  const { theme } = useCustomTheme();
  const watchCreateForum = watch('createForum', false);
  const [forumTopics, setForumTopics] = useState([]);

  useEffect(() => {
    const fetchForumTopics = async () => {
      const topicsRes = await getForumTopics(
        daoMetaData.boosts.discourse.metadata.categoryId,
      );

      console.log('topicsRes', topicsRes);
      setForumTopics(
        topicsRes.sort((a, b) => {
          return b.id - a.id;
        }),
      );
    };

    if (daoMetaData?.boosts.discourse?.active) {
      fetchForumTopics();
    }
  }, [daoMetaData]);

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
          <TextBox as={FormLabel} size='xs' htmlFor='createForum' mt={10}>
            Discourse Forum
          </TextBox>
          <FormControl mt={2} mb={5}>
            <Checkbox
              ref={register}
              name='createForum'
              defaultIsChecked={false}
            >
              <Box size='xs' htmlFor='createForum' mt={1}>
                Create a new topic
              </Box>
            </Checkbox>
          </FormControl>
          <FormControl mb={5}>
            <Select
              placeholder='Connect to a current topic'
              icon={<AiOutlineCaretDown />}
              name='forumId'
              color='whiteAlpha.900'
              ref={register}
              disabled={watchCreateForum}
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
        </>
      ) : null}
    </>
  );
};

export default DiscourseProposalFields;
