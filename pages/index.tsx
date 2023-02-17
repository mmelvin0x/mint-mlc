import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  Stack,
  Link as MLink,
  Typography,
  Checkbox,
  Container,
  CircularProgress,
  Avatar,
  Button,
  ButtonGroup,
  useTheme,
  Box,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
  AlertColor,
  LinearProgress,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  useContract,
  useContractMetadata,
  useUnclaimedNFTSupply,
  useClaimedNFTSupply,
  useActiveClaimCondition,
  Web3Button,
  ConnectWallet,
  useAddress,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { useState } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import axios from "axios";
import { Share } from "react-twitter-widgets";

interface NFT {
  metadata: {
    attributes: { trait_type: string; value: string };
    description: string;
    id: string;
    name: string;
    uri: string;
    image: string;
  };
  owner: string;
  supply: number;
  type: string;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

if (!CONTRACT_ADDRESS) {
  console.error(
    "You need to supply the NEXT_PUBLIC_CONTRACT_ADDRESS environment variable."
  );
  process.exit(1);
}

const defaultAlertState = {
  severity: "success" as AlertColor,
  message: "",
  open: false,
};

export default function Home() {
  const theme = useTheme();
  const { contract: nftDrop } = useContract(CONTRACT_ADDRESS, "nft-drop");

  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [selected, setSelected] = useState({} as NFT);
  const [twitterImage, setTwitterImage] = useState("");

  const prepareForSharing = async (it: NFT) => {
    console.log(it);
    const { data: image } = await axios.get(
      `${process.env.NEXT_PUBLIC_IMAGE_API}/api/twitterUrl?url=${it.metadata.image}`
    );

    setTwitterImage(`https://${image.url}`);
    setSelected(it);
  };

  // The connected wallet address
  const userAddress = useAddress();
  // The user's minted NFTs from this collection
  const { data: ownedNFTs } = useOwnedNFTs(nftDrop, userAddress);
  // The amount the user claims
  const [quantity, setQuantity] = useState(1); // default to 1
  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(nftDrop);
  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);
  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);
  // Create/set the alert state for errors and success messages
  const [alertState, setAlertState] = useState(defaultAlertState);
  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;
  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;
  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || "0",
    activeClaimCondition?.currencyMetadata.decimals
  );
  // Multiply depending on quantity
  const priceToMint = price.mul(quantity);
  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return (
      <Stack sx={{ padding: 3 }} alignItems="center" justifyContent={"center"}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Container maxWidth="md">
      <Head>
        <title>Memphis Lions Club</title>
        <meta name="description" content="Powered by RightClickable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState(defaultAlertState)}
      >
        <Alert
          onClose={() => setAlertState(defaultAlertState)}
          severity={alertState.severity}
          sx={{ width: "100%" }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>

      <Box sx={{ maxWidth: 100, marginTop: 3 }}>
        <ConnectWallet
          accentColor={theme.palette.primary.main}
          colorMode="dark"
        />
      </Box>

      <Stack alignItems={"center"} justifyContent="center" spacing={5} mt={5}>
        <Avatar
          src={contractMetadata?.image || ""}
          alt={`${contractMetadata?.name} preview image`}
          sx={{ width: 256, height: 256, border: "1px solid white" }}
        />

        <Typography variant="h2" fontWeight={"bold"} textAlign="center">
          {contractMetadata?.name}
        </Typography>

        {!hasAgreedToTerms && (
          <Stack spacing={2} alignItems={"center"} justifyContent={"center"}>
            <Typography>
              Click the check box to confirm that you have read and understand
              this{" "}
              <MLink>
                <Link href={"/terms"}>Disclaimer</Link>
              </MLink>
              .
            </Typography>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={false}
                    onChange={(e) =>
                      setHasAgreedToTerms(e.target?.checked || false)
                    }
                  />
                }
                label={"Accept"}
              />
            </FormGroup>
          </Stack>
        )}

        {hasAgreedToTerms && (
          <Stack spacing={2}>
            {
              // Sold out or show the claim button
              isSoldOut ? (
                <Typography variant="h6" fontWeight={"bold"} textAlign="center">
                  Sold Out
                </Typography>
              ) : isNotReady ? (
                <Typography variant="h6" fontWeight={"bold"} textAlign="center">
                  Not ready to be minted yet
                </Typography>
              ) : (
                <Stack alignItems={"center"} spacing={2}>
                  <Image
                    src={"/lions.gif"}
                    alt={"Preview GIF"}
                    width={345}
                    height={345}
                    style={{
                      maxWidth: 345,
                      padding: theme.spacing(2),
                      border: `1px solid ${theme.palette.text.primary}`,
                      borderRadius: theme.shape.borderRadius,
                    }}
                  />
                  <ButtonGroup>
                    <Button
                      variant="contained"
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>

                    <Button sx={{ width: "120px" }} variant="text">
                      {quantity}
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={
                        quantity >=
                        parseInt(
                          activeClaimCondition?.quantityLimitPerTransaction ||
                            "0"
                        )
                      }
                    >
                      +
                    </Button>
                  </ButtonGroup>

                  <Web3Button
                    contractAddress={CONTRACT_ADDRESS}
                    action={async (contract) =>
                      await contract.erc721.claim(quantity)
                    }
                    // If the function is successful, we can do something here.
                    onSuccess={async (result) => {
                      setAlertState({
                        open: true,
                        severity: "success",
                        message: `Successfully minted ${result.length} NFT${
                          result.length > 1 ? "s" : ""
                        }!`,
                      });
                    }}
                    // If the function fails, we can do something here.
                    onError={(error) =>
                      setAlertState({
                        message: error?.message,
                        severity: "error",
                        open: true,
                      })
                    }
                    accentColor={theme.palette.primary.main}
                    colorMode="dark"
                  >
                    {`Mint${quantity > 1 ? ` ${quantity}` : ""}${
                      activeClaimCondition?.price.eq(0)
                        ? " (Free)"
                        : activeClaimCondition?.currencyMetadata.displayValue
                        ? ` (${formatUnits(
                            priceToMint,
                            activeClaimCondition.currencyMetadata.decimals
                          )} ${activeClaimCondition?.currencyMetadata.symbol})`
                        : ""
                    }`}
                  </Web3Button>
                </Stack>
              )
            }

            {/* {claimedSupply && unclaimedSupply && (
              <Stack spacing={1}>
                <LinearProgress
                  variant="determinate"
                  value={
                    (100 * claimedSupply.toNumber()) /
                      (claimedSupply.toNumber() + unclaimedSupply.toNumber()) ||
                    0
                  }
                />
                <Typography
                  textAlign={"center"}
                >{`${claimedSupply.toNumber()}/${
                  claimedSupply.toNumber() + unclaimedSupply.toNumber()
                }`}</Typography>
              </Stack>
            )} */}

            {claimedSupply && unclaimedSupply && (
              <Stack spacing={1}>
                <LinearProgress
                  variant="determinate"
                  value={(100 * claimedSupply.toNumber()) / 1000 || 0}
                />
                <Typography
                  textAlign={"center"}
                >{`${claimedSupply.toNumber()}/1000`}</Typography>
              </Stack>
            )}
          </Stack>
        )}

        {!!ownedNFTs?.length && (
          <>
            <Typography variant="h4" fontWeight={"bold"}>
              Your Mints
            </Typography>

            <Typography variant="body2" fontWeight={"bold"}>
              Click the image to share your Lion on Twitter!
            </Typography>
          </>
        )}

        <Stack direction={"row"} flexWrap="wrap" justifyContent={"center"}>
          {ownedNFTs?.map((it) => (
            <Card
              key={it.metadata.id}
              sx={{
                maxWidth: 345,
                margin: 1,
                border: `1px solid ${theme.palette.text.primary}`,
                ":hover": {
                  cursor: "pointer",
                  transform: "scale(1.05)",
                },
              }}
              elevation={0}
              onClick={async () => await prepareForSharing(it as NFT)}
            >
              <CardMedia
                component="img"
                image={it.metadata.image?.toString() || ""}
                alt={it.metadata.name?.toString() || ""}
              />
              <CardContent>
                <Link
                  href={`https://opensea.io/assets/ethereum/${CONTRACT_ADDRESS}/${it.metadata.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MLink>{it.metadata.name}</MLink>
                </Link>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Dialog
          open={!!selected.metadata?.image}
          onClose={() => setSelected({} as NFT)}
        >
          <DialogTitle textAlign={"center"}>Share to Twitter!</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Image
              src={selected.metadata?.image || ""}
              height={256}
              width={256}
              alt="Twitter Share Image"
            />
            <Share
              url={twitterImage}
              options={{
                size: "large",
                text: `I just minted a @MemphisLions NFT!\n👉🦁👈\n\nMinting Now: https://mint.memphislionsclub.com\n\n#LiveLikeALion #MintMLC`,
              }}
            />
          </DialogContent>
        </Dialog>

        <Stack direction="row" spacing={1} alignItems="center" mb={5}>
          <Typography>Powered by</Typography>
          <Link
            href="https://rightclickable.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/rc-logo.png"
              alt="RightClickable Logo"
              width={36}
              height={36}
            />
          </Link>
        </Stack>
      </Stack>
    </Container>
  );
}
