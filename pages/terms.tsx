import { Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Terms() {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ margin: 10 }}
      spacing={3}
    >
      <Link href="/">Back</Link>
      <Typography variant="h3">RIGHTCLICKABLE Disclaimer</Typography>
      <Typography>
        By clicking accept, I acknowledge, understand, and accept everything
        contained in this Disclaimer.
      </Typography>
      <Typography>
        Accordingly, nothing contained in this website or in any communicate by
        any member of RIGHTCLICKABLE (the “Company”) is to be construed to give
        legal, financial, investment, or business advice. Nothing should be
        construed as a recommendation to buy, sell, or hold any NFT. You are
        solely responsible for determining whether buying an NFT is for you.
      </Typography>
      <Typography>
        Collectible NFTs are neither investments, a security token, nor an
        e-money token, and they are classified as unregulated. NFTs are not a
        store of value and are not a generally accepted medium of exchange. NFTs
        are very illiquid and volatile.
      </Typography>
      <Typography>
        There is absolutely no promise of any financial return. NFTs do not have
        any value. There is no guarantee that you can make a return or even sell
        your NFT. The Company’s NFTs are not investment products, securities,
        initial coin offerings, or anything similar or financial of any
        description. When you purchase an NFT from the Company, it is solely for
        fun.
      </Typography>
      <Typography>
        These NFTs are art by the Company celebrating Memphis Depay. Mint this
        only if you like the collectible art and want to have it. Do your own
        research and participate in NFT collecting in a responsible manner.
      </Typography>
      <Typography>
        The Company makes no guarantees about anything. There is no promise of
        utility of any kind. You are purchasing this NFT solely as a collectable
        and for fun. You may not rely on any statement made by any member of the
        Company other than what is published <strong>ONLY</strong> in this
        Disclaimer.
      </Typography>
      <Link href="/">Back</Link>
    </Stack>
  );
}
