export const handleCustomAwait = async (
  awaitType,
  then,
  setFormState,
  setValue,
  values,
) => {
  setFormState(true);
  try {
    await awaitType.func(...awaitType.args, setValue, values);
    if (typeof then === 'function') {
      then();
      setFormState(false);
    } else {
      setFormState(false);
    }
  } catch (error) {
    console.error(error);
    setFormState('error');
  }
};
