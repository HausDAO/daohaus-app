import React from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Box, Flex, Skeleton, Button } from "@chakra-ui/react";
import makeBlockie from "ethereum-blockies-base64";

// import { useMembers } from "../../contexts/PokemolContext";
// import { useTheme } from "../../contexts/CustomThemeContext";
// import { numberWithCommas, themeImagePath } from "../../utils/helpers";
import ContentBox from "./ContentBox";
import TextBox from "./TextBox";
import BankTotal from "./bankTotal";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useMetaData } from "../contexts/MetaDataContext";

const DaoOverviewDetails = ({ dao, members, overview }) => {
  const { daoMetadata } = useMetaData();
  const { theme } = useCustomTheme();

  const history = useHistory();
  console.log("daoMetadata", daoMetadata);
  console.log("theme", theme);
  return (
    <Box>
      <TextBox size="sm" color="whiteAlpha.900">
        Details
      </TextBox>
      <ContentBox mt={2} w="100%">
        <Flex direction="row" align="center">
          {/* <Avatar
            src={
              dao.avatarImg
                ? themeImagePath(dao.avatarImg)
                : makeBlockie(dao.address || "0x0")
            }
            mr="10px"
          ></Avatar> */}
          <Skeleton isLoaded={daoMetadata.name} ml={6}>
            <Box fontSize="2xl" fontWeight={700} fontFamily="heading">
              {daoMetadata.name ? daoMetadata.name : "--"}
            </Box>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={daoMetadata?.description}>
          <Box mt={6}>
            {daoMetadata?.description ? daoMetadata.description : "--"}
          </Box>
        </Skeleton>
        <Flex direction="row" w="100%" justify="space-between" mt={6}>
          <Box>
            <TextBox size="xs">{daoMetadata.members}</TextBox>
            <Skeleton isLoaded={members}>
              <TextBox size="lg" variant="value">
                {members?.length ? members.length : 0}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size="xs">Shares</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalShares}>
              <TextBox size="lg" variant="value">
                {/* {dao?.graphData?.totalShares
                  ? numberWithCommas(dao.graphData.totalShares)
                  : "--"} */}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size="xs">Loot</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalLoot}>
              <TextBox size="lg" variant="value">
                {/* {dao?.graphData?.totalLoot
                  ? numberWithCommas(dao?.graphData?.totalLoot)
                  : "--"} */}
              </TextBox>
            </Skeleton>
          </Box>
        </Flex>
        <Box mt={6}>
          {/* <TextBox size="md">{theme.daoMeta.bank}</TextBox> */}
          {/* <BankTotal tokenBalances={dao?.graphData?.tokenBalances} dao={dao} /> */}
        </Box>
        <Flex mt={6}>
          <Button
            variant="outline"
            mr={6}
            onClick={() => history.push(`/dao/${dao.address}/bank`)}
          >
            {/* View {theme.daoMeta.bank} */}
          </Button>
          <Button onClick={() => history.push(`/dao/${dao.address}/proposals`)}>
            {/* View {theme.daoMeta.proposals} */}
          </Button>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default DaoOverviewDetails;
