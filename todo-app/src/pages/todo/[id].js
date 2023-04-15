import { useRouter } from "next/router";
import TodoFull from "@/components/TodoFull";
import Navbar from "@/components/Navbar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

export default function todoPage() {
    const router = useRouter();
    const {id} = router.query;
    const text = "just testing";
    if (text) {
        return <>
            <SignedIn>
                <Navbar />
                <TodoFull id={id}></TodoFull>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn /> {/* change to redirect to / page */}
            </SignedOut>
        </>
    } else {
        return <></>
    }
}