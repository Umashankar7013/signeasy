import { PrimaryButton } from "./PrimaryButton";

export const AuthorizeButton = ({ onClick = () => {} }) => (
  <PrimaryButton
    title="Authorize"
    className="w-[250px] border-[#1088E7]"
    titleClassName="py-[5px] text-[#1088E7]"
    onClick={onClick}
  />
);
