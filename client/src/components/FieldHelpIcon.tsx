import { Box, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type FieldHelpIconProps = {
  title?: string;
};

/** Small help icon with hover tooltip; renders nothing when title is missing. */
export function FieldHelpIcon({ title }: FieldHelpIconProps) {
  if (!title) return null;

  return (
    <Tooltip title={title} arrow placement="top" enterDelay={250}>
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          ml: 0.5,
          color: "text.secondary",
          cursor: "help",
          verticalAlign: "middle",
          lineHeight: 1,
        }}
        aria-label={title}
      >
        <HelpOutlineIcon sx={{ fontSize: 14 }} />
      </Box>
    </Tooltip>
  );
}
