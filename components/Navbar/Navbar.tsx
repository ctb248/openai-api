import { Navbar, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import SelectModel from "../SelectModel/SelectModel";

const Header = () => {
  const router = useRouter();

  console.log(router.route);

  return (
    <Navbar isBordered variant={"static"}>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          ACME
        </Text>
      </Navbar.Brand>

      <Navbar.Content>{router.route === "/" && <SelectModel />}</Navbar.Content>
    </Navbar>
  );
};

export default Header;
