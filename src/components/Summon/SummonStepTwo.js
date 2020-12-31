import React from 'react';
import { useForm } from 'react-hook-form';

import { Box, Button, Input, Textarea } from '@chakra-ui/react';
import { RiArrowRightFill, RiArrowLeftFill } from 'react-icons/ri';

const SummonStepTwo = ({ daoData, setDaoData, setCurrentStep }) => {
  const { register, getValues, watch } = useForm({
    defaultValues: daoData,
  });
  const watchAllFields = watch();
  const canMoveForward = watchAllFields.name && watchAllFields.description;

  const navigate = (step) => {
    setDaoData((prevState) => {
      return { ...prevState, ...getValues() };
    });
    setCurrentStep(step);
  };

  return (
    <Box className='SummonStepTwo'>
      <Box>
        <form className='Form'>
          <label>Name your DAO</label>
          <Input name='name' ref={register} placeholder='Braid Guild' />

          <label>Describe its purpose</label>
          <Textarea
            name='description'
            ref={register}
            rows='8'
            placeholder='Banging the best braids since 2020'
          />
        </form>
      </Box>
      <Box>
        <Box className='StepControl'>
          <Button onClick={() => navigate(1)} className='Outlined'>
            <RiArrowLeftFill /> GO BACK
          </Button>
          <Button
            onClick={() => navigate(3)}
            disabled={!canMoveForward}
            className={!canMoveForward ? 'disabled' : ''}
          >
            NEXT STEP <RiArrowRightFill/>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SummonStepTwo;
