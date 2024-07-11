import * as React from "react";
import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";

export default function AccordionDepthPanel({ data }) {
  return (
    <AccordionGroup
      className="bg-white shadow-lg"
      variant="outlined"
      transition="0.2s"
      sx={{
        maxWidth: 600,
        borderRadius: "lg",
        [`& .${accordionSummaryClasses.button}:hover`]: {
          bgcolor: "transparent",
        },
        [`& .${accordionDetailsClasses.content}`]: {
          boxShadow: (theme) => `inset 0 1px ${theme.vars.palette.divider}`,
          [`&.${accordionDetailsClasses.expanded}`]: {
            paddingBlock: "0.75rem",
          },
        },
      }}
    >
      {data &&
        data.map((i, index) => (
          <Accordion defaultExpanded={index === 0} key={i.name}>
            <AccordionSummary>{i.title}</AccordionSummary>
            <AccordionDetails variant="soft">{i.description}</AccordionDetails>
          </Accordion>
        ))}
    </AccordionGroup>
  );
}
