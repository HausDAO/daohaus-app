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
  padding: 0.8rem 0.8rem;
  /* border-bottom: 1px solid ${getColor("lightBorder")}; */

  .label {
    margin-bottom: 0.8rem;
  }
  .title {
    margin-bottom: 0.8rem;
  }

  .inner-section {
    padding: 0.8rem;
    /* padding-bottom: 1.6rem; */
  }
  .par {
    margin-bottom: 0.8rem;
  }
`;
