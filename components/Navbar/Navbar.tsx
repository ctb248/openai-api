import { Navbar, Text, Button, Link } from "@nextui-org/react";

const Header = () => {
  return (
    <Navbar isBordered variant={"static"}>
      <Navbar.Brand>
        <Text b color="inherit" hideIn="xs">
          ACME
        </Text>
      </Navbar.Brand>

      <Navbar.Content>
        <Navbar.Link color="inherit" href="#">
          Login
        </Navbar.Link>
        <Navbar.Item>
          <Button auto flat as={Link} href="#">
            Sign Up
          </Button>
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
};

export default Header;
