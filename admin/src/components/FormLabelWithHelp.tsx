import { Box } from "@mui/material";
import { FieldHelpIcon } from "./FieldHelpIcon";

type FormLabelWithHelpProps = {
  label: string;
  title?: string;
  /** Keep last word + icon together so the help icon doesn't wrap alone. */
  glueIconToLastWord?: boolean;
};

/** Label text with an optional FormView-style help tooltip icon. */
export function FormLabelWithHelp({
  label,
  title,
  glueIconToLastWord = false,
}: FormLabelWithHelpProps) {
  if (!glueIconToLastWord) {
    return (
      <>
        {label}
        <FieldHelpIcon title={title} />
      </>
    );
  }

  const words = label.split(" ");
  if (words.length <= 1) {
    return (
      <Box component="span" sx={{ whiteSpace: "nowrap" }}>
        {label}
        <FieldHelpIcon title={title} />
      </Box>
    );
  }

  return (
    <>
      {`${words.slice(0, -1).join(" ")} `}
      <Box component="span" sx={{ whiteSpace: "nowrap" }}>
        {words.at(-1)}
        <FieldHelpIcon title={title} />
      </Box>
    </>
  );
}
