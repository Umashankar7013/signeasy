import { PrimaryButton } from "./PrimaryButton";

export const AuthorizeButton = ({ onClick = () => {} }) => (
  <PrimaryButton
    title="Authorize"
    className="w-[250px] border-[#1088E7] rounded-[8px]"
    titleClassName="py-[5px] text-[18px] text-[#1088E7]"
    onClick={onClick}
  />
);
