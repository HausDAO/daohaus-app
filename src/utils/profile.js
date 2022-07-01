import { tallyUSDs } from './tokenValue';

import { FORM } from '../data/formLegos/forms';
import {
  getBasicProfile,
  setBasicProfile,
  cacheProfile,
  authenticateDid,
} from '../utils/3box';
import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

export const calcValue = (member, daoTokens, overview) => {
  if (daoTokens && member && overview) {
    const { loot, shares } = member;
    const { totalShares, totalLoot } = overview;
    const totalDaoVal = tallyUSDs(daoTokens);
    const memberProportion =
      (+shares + +loot) / (+totalShares + +totalLoot) || 0;

    const result = memberProportion * totalDaoVal;

    return result.toFixed(2);
  }
  return 0;
};

export const calcPower = (member, overview) => {
  if (member?.shares && overview?.totalShares) {
    const total = (member.shares / overview.totalShares) * 100;
    return total.toFixed(1);
  }
  return 0;
};

export const getProfileForm = onSubmitCallback => {
  let client = null;
  let did = null;

  const { address } = useInjectedProvider();
  const { refreshMemberProfile } = useUser(null);

  return {
    DISPLAY: {
      type: 'buttonAction',
      title: 'Edit Ceramic Profile',
      checklist: ['isConnected'],
      btnText: 'Connect',
      btnLabel: 'Connect to Ceramic',
      btnLoadingText: 'Connecting',
      btnNextCallback: values => {
        return values?.ceramicDid;
      },
      btnCallback: async (setValue, setLoading, setFormState) => {
        setLoading(true);
        try {
          [client, did] = await authenticateDid(
            window.ethereum.selectedAddress,
          );
          setValue('ceramicClient', client);
          setValue('ceramicDid', did);
          const profile = await getBasicProfile(did?.id);
          setValue('name', profile?.name || '');
          setValue('emoji', profile?.emoji || '');
          setValue('description', profile?.description || '');
          setValue('homeLocation', profile?.homeLocation || '');
          setValue('url', profile?.url || '');
          setValue('image', profile?.image || '');
          setFormState('success');
        } catch (err) {
          console.error(err);
          setFormState('failed');
        }
        setLoading(false);
      },
      next: 'STEP2',
      start: true,
    },
    STEP2: {
      type: 'form',
      title: 'Edit Ceramic Profile',
      subtitle: 'Connected to Ceramic',
      form: {
        ...FORM.PROFILE,
        ctaText: 'Submit',
        formSuccessMessage: 'Connected',
        checklist: ['isConnected'],
        onSubmit: async ({ values }) => {
          const profileArray = Object.entries({
            name: values?.name || null,
            emoji: values?.emoji || null,
            description: values?.description || null,
            homeLocation: values?.homeLocation || null,
            url: values?.url || null,
            image: values?.image || null,
          }).filter(value => value[1] !== null);
          const profile = Object.fromEntries(profileArray);
          await setBasicProfile(client, did, profile);
          cacheProfile(profile, address);
          await refreshMemberProfile();
          await setBasicProfile(client, did, profile);
          await onSubmitCallback(profile);
          client = null;
          did = null;
        },
      },
      ctaText: 'Finish',
      isUserStep: true,
      finish: true,
      stepLabel: 'Update profile',
    },
  };
};
