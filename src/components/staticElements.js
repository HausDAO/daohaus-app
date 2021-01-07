import styled from "styled-components";
import { getColor } from "../styles/palette";

export const Divider = styled.div`
  height: 1px;
  border-bottom: 1px solid ${getColor("grey200")};
  margin-bottom: 0.8rem;
  &.hard {
    border-bottom: 1px solid ${getColor("grey300")};
    margin-bottom: 1.6rem;
  }
  &.push-top {
    margin-top: auto;
  }
`;
export const ListItemCard = styled.section`
  margin-bottom: 1.6rem;
  padding: 0.8rem 0;
  /* border-bottom: 1px solid ${getColor("lightBorder")}; */

  .label {
    margin-bottom: 0.8rem;
  }
  .title {
    margin-bottom: 0.8rem;
  }

  .inner-section {
    padding: 0.8rem 0;
    /* padding-bottom: 1.6rem; */
  }
  .par {
    margin-bottom: 0.8rem;
  }
`;
export const SplitLayout = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(28rem, 56rem) 12rem minmax(36rem, auto);
  grid-template-rows: 8.4rem auto;
  .title-section {
    height: 100%;
    h2 {
      margin-bottom: 2.4rem;
    }
    grid-row: 1;
    grid-column: 1/5;
  }
`;
export const SideBar = styled.div`
  height: calc(100% - 5.6rem);
  width: 32rem;
  position: fixed;
  padding-top: 1.6rem;
  top: 5.6rem;
  background-color: ${getColor("grey200")};
`;
export const StyledSideMenu = styled.div`
  height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .top-list-section,
  .btn-list-section,
  .people-list-section,
  .feedback-about-section {
    padding: 1.6rem 2.4rem;
  }
  .btn-list-section,
  .feedback-about-section {
    button {
      margin-bottom: 0.8rem;
      padding: 0.4rem 0;
    }
    button:last-child {
      margin-bottom: 0;
    }
  }
  .people-list-section {
    margin-bottom: auto;
  }
  .list-button {
    padding: 0;
    font-weight: 400;
    span.icon-wrapper {
      margin-right: 1.2rem;
    }
    svg {
      color: ${getColor("grey500")};
      transition: 0.2s color;
    }
    :hover {
      svg {
        color: ${getColor("grey600")};
      }
    }
  }
  .nav-btns {
    margin-top: 4rem;
    margin-bottom: 1.6rem;
  }
  .user-project-list {
    list-style: none;
    margin-top: 1.6rem;
    margin-bottom: 3.2rem;
    max-height: 50%;
    overflow-y: auto;
  }
  .end-btns {
    display: flex;
  }
  .hard {
    margin-bottom: 0;
  }
`;
