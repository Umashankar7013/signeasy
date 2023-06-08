import { PrimaryButton } from "./PrimaryButton";

export const RevokeButton = ({ onClick = () => {}, loading }) => (
  <div>
    <PrimaryButton
      title="Revoke"
      className="w-[250px] border-[#F76868] rounded-[8px]"
      titleClassName="py-[5px] text-[#F76868]"
      onClick={onClick}
      loading={loading}
    />
    <div className="text-[green] font-inter text-center pt-[10px]">
      Authorized Succesfully
    </div>
  </div>
);
