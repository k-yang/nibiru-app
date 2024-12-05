import {
  Box,
  Button,
  Icon,
  Link,
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
      <Box display="flex" justifyContent="space-between" mb="$8">
        <Box display="flex" gap={"$12"}>
          <Box
            backgroundColor={useColorModeValue("$primary100", "$primary900")}
            paddingX={"$8"}
            paddingY={"$4"}
            borderRadius={"$2xl"}
          >
            <Link href="/balance">
              <Text
                color={useColorModeValue("$primary900", "$primary100")}
              >
                Balance
              </Text>
            </Link>
          </Box>
          <Box
            backgroundColor={useColorModeValue("$primary100", "$primary900")}
            paddingX={"$8"}
            paddingY={"$4"}
            borderRadius={"$2xl"}
          >
            <Link href="/stake">
              <Text
                color={useColorModeValue("$primary900", "$primary100")}
              >
                Stake
              </Text>
            </Link>
          </Box>
          <Box
            backgroundColor={useColorModeValue("$primary100", "$primary900")}
            paddingX={"$8"}
            paddingY={"$4"}
            borderRadius={"$2xl"}
          >
            <Link href="/address">
              <Text
                color={useColorModeValue("$primary900", "$primary100")}
              >
                Stake
              </Text>
            </Link>
          </Box>
        </Box>
        <Button
          intent="secondary"
          size="sm"
          onClick={toggleColorMode}
        >
          <Icon name={useColorModeValue("moonLine", "sunLine")} />
        </Button>
      </Box>

      <Box textAlign="center">
        <Text
          as="h1"
          fontWeight="$bold"
          fontSize={{ mobile: "$6xl", tablet: "$10xl" }}
        >
          Kevin&apos;s Unofficial Nibiru Webapp
        </Text>
        <Text as="h2">
          <Text
            as="p"
            color={useColorModeValue("$primary500", "$primary200")}
          >
            Created for learning and experimentation.
          </Text>
        </Text>
      </Box>
    </>
  );
}
