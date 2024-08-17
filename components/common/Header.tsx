import { dependencies } from "@/config";
import {
  Box,
  Button,
  Icon,
  Text,
  useColorModeValue,
  useTheme
} from "@interchain-ui/react";

const stacks = ["CosmosKit", "Next.js"];

const osmojs = dependencies[0];

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
          Unofficial Nibiru Webapp
        </Text>
        <Text as="h2" fontWeight="$bold">
          <Text
            as="span"
            fontSize={{ mobile: "$3xl", tablet: "$8xl", desktop: "$8xl" }}
            color={useColorModeValue("$primary500", "$primary200")}
          >
            This webapp is an unofficial Nibiru webapp created by Kevin Yang for the purposes of learning and experimentation.
          </Text>
        </Text>
      </Box>
    </>
  );
}
