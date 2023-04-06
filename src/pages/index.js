import { useRouter } from "next/router";
import { PrimaryButton } from "../components/PrimaryButton";
import { popupHandler } from "../utils/functions";
import { DEPLOYMENT_URL } from "../constants/constants";

export default function SigneasyApp() {
  const router = useRouter();
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center">
      <PrimaryButton
        title="Authorization Page"
        className="w-fit px-[20px] py-[10px] bg-[pink]"
        titleClassName="font-lexend"
        onClick={() => router.push("/home")}
      />
      <PrimaryButton
        title="Templates page"
        className="w-fit px-[20px] py-[10px]  mt-[10px] bg-[orange]"
        titleClassName="font-lexend"
        onClick={() => popupHandler({ url: `${DEPLOYMENT_URL}templates` })}
      />
      <PrimaryButton
        title="Signature page"
        className="w-fit px-[20px] py-[10px] mt-[10px] bg-yellow-200"
        titleClassName="font-lexend"
        onClick={() => popupHandler({ url: `${DEPLOYMENT_URL}signature` })}
      />
      <PrimaryButton
        title="Documents page"
        className="w-fit px-[20px] py-[10px] mt-[10px] bg-red-500"
        titleClassName="font-lexend"
        onClick={
          () => popupHandler({ url: `${DEPLOYMENT_URL}documents` })
          // router.push("/documents")
        }
      />
    </div>
  );
}
