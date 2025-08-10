import UnauthorizedDisplay from "./component/unauthorized-display";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unauthorized | TtokTtok Admin",
  description: "Unauthorized Access",
};

const UnauthorizedPage = () => {
  return <UnauthorizedDisplay />;
};

export default UnauthorizedPage;
