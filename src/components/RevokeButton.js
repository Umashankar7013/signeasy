import { PrimaryButton } from "./PrimaryButton";

export const RevokeButton = ({ onClick = () => {} }) => (
  <div>
    <div className="text-[green] font-inter text-center pb-[10px]">
      Authorized Succesfully
    </div>
    <PrimaryButton
      title="Revoke"
      className="w-[250px] border-[red]"
      titleClassName="py-[5px] text-[red]"
      onClick={onClick}
    />
  </div>
);
