import {
  Box,
  Button,
  Icon,
  Text,
  useColorModeValue,
  useTheme
} from "@interchain-ui/react";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Box display="flex" justifyContent="end" mb="$8">
        <Button
          intent="secondary"
          size="sm"
          attributes={{
            paddingX: 0,
          }}
          onClick={toggleColorMode}
        >
          <Icon name={useColorModeValue("moonLine", "sunLine")} />
        </Button>
      </Box>

      <Box textAlign="center">
        <Text
          as="h1"
          fontWeight="$extrabold"
          fontSize={{ mobile: "$6xl", tablet: "$10xl" }}
          attributes={{
            marginBottom: "$8",
          }}
        >
          Kevin&apos;s Nibiru Webapp
        </Text>
        <Text as="h2">
          <Text
            as="span"
            fontSize={{ mobile: "$2xl", tablet: "$4xl", desktop: "$4xl" }}
            color={useColorModeValue("$primary500", "$primary200")}
          >
            An unofficial Nibiru webapp created by Kevin Yang for learning and experimentation.
          </Text>
        </Text>
      </Box>
    </>
  );
}
