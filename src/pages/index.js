import { useRouter } from "next/router";
import { PrimaryButton } from "../components/PrimaryButton";
import { popupHandler } from "../utils/functions";

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
        onClick={
          () =>
            popupHandler({
              url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}templates?authId=0d30e7a2-42f6-4aef-ba70-a7d0e86ef936&object_id=51&object_type=CONTACT#https://app.hubspot.com`,
            })
          // router.push("/templates")
        }
      />
      <PrimaryButton
        title="Documents page"
        className="w-fit px-[20px] py-[10px] mt-[10px] bg-red-500"
        titleClassName="font-lexend"
        onClick={() =>
          popupHandler({
            url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}documents?authId=0d30e7a2-42f6-4aef-ba70-a7d0e86ef936&object_id=51&object_type=CONTACT#https://app.hubspot.com`,
          })
        }
      />
      <PrimaryButton
        title="signeasy Auth"
        className="w-fit px-[20px] py-[10px]  mt-[10px] bg-[yellow]"
        titleClassName="font-lexend"
        onClick={() => router.push("/oauth/signeasy")}
      />
    </div>
  );
}
