import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function DoneCategoryPage() {
    const router = useRouter();
    const {category} = router.query;
    const text = "just testing";
    if (text) {
        return <>
            <SignedIn>
                <Navbar />
                <TodoFull id={category} text={text}></TodoFull>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    } else {
        return <></>
    }
}