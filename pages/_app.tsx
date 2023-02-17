import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "1rem",
        },
      },
    },
  },
});

const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || ChainId.Goerli;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ThirdwebProvider desiredChainId={chainId}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
