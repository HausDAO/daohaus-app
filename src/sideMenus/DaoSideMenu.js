import React from "react";
import { Users, List, DollarSign, ArrowLeftCircle } from "react-feather";
import { useHistory, useParams } from "react-router-dom";

import Button from "../components/button";
import { HeaderMd } from "../styles/typography";
import { SideBar, StyledSideMenu, Divider } from "../components/staticElements";

const DaoSideMenu = ({ title }) => {
  const history = useHistory();
  const { daoid, daochain } = useParams();

  const goTo = (e) => {
    history.push(`/dao/${daochain}/${daoid}/${e.target.value}`);
  };
  const goToHub = (e) => {
    history.push(`/hub`);
  };

  return (
    <SideBar>
      <StyledSideMenu>
        <div className="top-list-section">
          <Button
            className="text-button"
            content={<HeaderMd>{title}</HeaderMd>}
            onClick={goTo}
            value=""
          />
        </div>
        <Divider className="hard" />
        <div className="btn-list-section">
          <Button
            className="text-button list-button"
            withIcon={<List size="2.4rem" />}
            content="Proposals"
            onClick={goTo}
            value="proposals"
          />
          <Button
            className="text-button list-button"
            withIcon={<DollarSign size="2.4rem" />}
            content="Balances"
            onClick={goTo}
            value="bank"
          />
          <Button
            className="text-button list-button"
            withIcon={<Users size="2.4rem" />}
            content="Members"
            onClick={goTo}
            value="members"
          />
          <Button
            className="text-button list-button"
            withIcon={<ArrowLeftCircle size="2.4rem" />}
            content="Back To Hub"
            onClick={goToHub}
          />
        </div>

        <Divider className="hard" />
        <div className="people-list-section">
          {/* Could be a great section to list the top members Or the projects a user
        is affiliated with. */}
        </div>
        {/* <FeedbackAbout /> */}
      </StyledSideMenu>
    </SideBar>
  );
};

export default DaoSideMenu;
