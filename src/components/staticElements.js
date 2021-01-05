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
